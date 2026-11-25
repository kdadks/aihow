$ErrorActionPreference = 'Stop'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$envFile = Join-Path $projectRoot '.env.local'
$sourceProjectRef = 'bynlkphjpmxskoqiahow'

if (-not (Test-Path -LiteralPath $envFile -PathType Leaf)) {
  throw 'Missing .env.local. Add SOURCE_DATABASE_URL locally; do not commit database credentials.'
}

$sourceLine = Get-Content -LiteralPath $envFile |
  Where-Object { $_ -match '^\s*SOURCE_DATABASE_URL=' } |
  Select-Object -First 1

if (-not $sourceLine) {
  throw 'Missing SOURCE_DATABASE_URL in .env.local.'
}

$sourceUrl = ($sourceLine -replace '^\s*SOURCE_DATABASE_URL=', '').Trim().Trim('"').Trim("'")
if (-not $sourceUrl) {
  throw 'SOURCE_DATABASE_URL is empty in .env.local.'
}

try {
  $connectionUri = [Uri]$sourceUrl
} catch {
  throw 'SOURCE_DATABASE_URL is not a valid PostgreSQL connection URI.'
}

$encodedUserInfo = $connectionUri.UserInfo
$separator = $encodedUserInfo.IndexOf(':')
if ($separator -lt 1) {
  throw 'SOURCE_DATABASE_URL must include a username and password.'
}

$connectionUser = [Uri]::UnescapeDataString($encodedUserInfo.Substring(0, $separator))
$connectionPassword = [Uri]::UnescapeDataString($encodedUserInfo.Substring($separator + 1))
$databaseName = [Uri]::UnescapeDataString($connectionUri.AbsolutePath.TrimStart('/'))
if (
  $connectionUri.Host -notmatch 'pooler\.supabase\.com$' -or
  "$($connectionUri.Host) $connectionUser" -notmatch [regex]::Escape($sourceProjectRef) -or
  -not $connectionPassword -or
  -not $databaseName
) {
  throw 'Use the source project Session pooler URI in SOURCE_DATABASE_URL.'
}

$pgDump = Get-Command pg_dump -ErrorAction SilentlyContinue
$pgRestore = Get-Command pg_restore -ErrorAction SilentlyContinue
if (-not $pgDump -or -not $pgRestore) {
  throw 'pg_dump and pg_restore are required. Install PostgreSQL client tools first.'
}

$exportDirectory = Join-Path $projectRoot 'supabase\exports'
$archivePath = Join-Path $exportDirectory 'source-public.dump'
$structurePath = Join-Path $exportDirectory 'source-public-structure.sql'
$dataPath = Join-Path $exportDirectory 'source-public-data.sql'
$structureTempPath = "$structurePath.tmp"
$dataTempPath = "$dataPath.tmp"

if (-not (Test-Path -LiteralPath $exportDirectory -PathType Container)) {
  New-Item -ItemType Directory -Path $exportDirectory | Out-Null
}

$outputPaths = @($archivePath, $structurePath, $dataPath, $structureTempPath, $dataTempPath)
$existingOutputs = $outputPaths | Where-Object { Test-Path -LiteralPath $_ }
if ($existingOutputs) {
  throw "Refusing to overwrite existing export files: $($existingOutputs -join ', ')"
}

$previousPgOptions = $env:PGOPTIONS
$previousPgPassword = $env:PGPASSWORD
$previousPgSslMode = $env:PGSSLMODE
$env:PGOPTIONS = '-c default_transaction_read_only=on'
$env:PGPASSWORD = $connectionPassword
$env:PGSSLMODE = 'require'
$exportComplete = $false

try {
  Write-Output 'Exporting the source public schema and data to a local archive...'
  $pgDumpArguments = @(
    '--schema=public'
    '--format=custom'
    '--no-owner'
    '--no-acl'
    "--file=$archivePath"
    "--host=$($connectionUri.Host)"
    "--port=$($connectionUri.Port)"
    "--username=$connectionUser"
    "--dbname=$databaseName"
  )
  & $pgDump.Source @pgDumpArguments
  if ($LASTEXITCODE -ne 0) {
    throw "pg_dump failed with exit code $LASTEXITCODE."
  }

  Write-Output 'Writing the structure SQL file...'
  & $pgRestore.Source --schema-only --no-owner --no-acl --file=$structureTempPath $archivePath
  if ($LASTEXITCODE -ne 0) {
    throw "pg_restore structure export failed with exit code $LASTEXITCODE."
  }

  Write-Output 'Writing the data SQL file...'
  & $pgRestore.Source --data-only --no-owner --no-acl --file=$dataTempPath $archivePath
  if ($LASTEXITCODE -ne 0) {
    throw "pg_restore data export failed with exit code $LASTEXITCODE."
  }

  $structureSql = [System.IO.File]::ReadAllText($structureTempPath)
  $structureSql = $structureSql.Replace('public.', 'how2doai.')
  $structureSql = $structureSql.Replace('CREATE SCHEMA public;', 'CREATE SCHEMA IF NOT EXISTS how2doai;')
  $structureSql = $structureSql.Replace('-- Name: public; Type: SCHEMA;', '-- Name: how2doai; Type: SCHEMA;')
  $structureSql = $structureSql.Replace('-- Name: SCHEMA public; Type: COMMENT;', '-- Name: SCHEMA how2doai; Type: COMMENT;')
  $structureSql = $structureSql.Replace('Schema: public;', 'Schema: how2doai;')
  $structureSql = $structureSql.Replace(
    "COMMENT ON SCHEMA public IS 'standard public schema';",
    "COMMENT ON SCHEMA how2doai IS 'standard how2doai schema';"
  )
  $structureSql = $structureSql.Replace("SET search_path TO '', 'public'", "SET search_path TO '', 'how2doai'")
  $structureSql = $structureSql.Replace("WHERE table_schema = 'public';", "WHERE table_schema = 'how2doai';")
  $structureSql = [regex]::Replace($structureSql, '(?m)^\\(?:restrict|unrestrict)\s+\S+\s*\r?\n?', '')
  if (
    $structureSql.Contains('CREATE SCHEMA public;') -or
    $structureSql.Contains('COMMENT ON SCHEMA public ') -or
    $structureSql.Contains('public.') -or
    $structureSql.Contains('Schema: public;') -or
    $structureSql.Contains("SET search_path TO '', 'public'") -or
    $structureSql.Contains("WHERE table_schema = 'public';")
  ) {
    throw 'The structure dump still contains source-schema references.'
  }
  [System.IO.File]::WriteAllText($structureTempPath, $structureSql, [System.Text.UTF8Encoding]::new($false))

  $dataLines = [System.Collections.Generic.List[string]]::new()
  $insideCopyBlock = $false
  $copyHeaderCount = 0
  foreach ($line in [System.IO.File]::ReadAllLines($dataTempPath)) {
    if ($insideCopyBlock) {
      $dataLines.Add($line)
      if ($line -eq '\.') {
        $insideCopyBlock = $false
      }
      continue
    }

    if ($line.StartsWith('COPY public.')) {
      $line = $line.Replace('COPY public.', 'COPY how2doai.')
      $copyHeaderCount++
      $insideCopyBlock = $true
    } elseif ($line -match "^SELECT pg_catalog\.setval\('public\.") {
      $line = $line.Replace("'public.", "'how2doai.")
    }
    $dataLines.Add($line)
  }
  if ($insideCopyBlock -or $copyHeaderCount -eq 0) {
    throw 'The data dump COPY blocks could not be safely remapped.'
  }
  foreach ($line in $dataLines) {
    if ($line.StartsWith('COPY public.') -or $line -match "^SELECT pg_catalog\.setval\('public\.") {
      throw 'The data dump still contains source-schema references.'
    }
  }
  [System.IO.File]::WriteAllLines($dataTempPath, $dataLines, [System.Text.UTF8Encoding]::new($false))

  foreach ($file in @($structureTempPath, $dataTempPath)) {
    if (-not (Test-Path -LiteralPath $file -PathType Leaf) -or (Get-Item -LiteralPath $file).Length -eq 0) {
      throw "Expected SQL export was not created: $file"
    }
  }

  Move-Item -LiteralPath $structureTempPath -Destination $structurePath
  Move-Item -LiteralPath $dataTempPath -Destination $dataPath
  $exportComplete = $true
} finally {
  $env:PGOPTIONS = $previousPgOptions
  $env:PGPASSWORD = $previousPgPassword
  $env:PGSSLMODE = $previousPgSslMode
}

if ($exportComplete) {
  Remove-Item -LiteralPath $archivePath -Force
  Write-Output "Structure: $structurePath"
  Write-Output "Data:      $dataPath"
  Write-Output 'Both SQL files were generated from the same read-only database snapshot.'
}
