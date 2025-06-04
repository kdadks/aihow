#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Default values for local development
const defaultEnv = {
  CYPRESS_BASE_URL: 'http://localhost:5173',
  CYPRESS_SUPABASE_URL: 'http://localhost:54321',
  CYPRESS_SUPABASE_ANON_KEY: 'your-local-anon-key',
  // Add more default values as needed
};

function createCypressEnvFile() {
  const cypressEnvPath = path.join(process.cwd(), 'cypress.env.json');
  const existingEnv = fs.existsSync(cypressEnvPath)
    ? JSON.parse(fs.readFileSync(cypressEnvPath, 'utf8'))
    : {};

  // Merge existing env with defaults, preferring existing values
  const mergedEnv = {
    ...defaultEnv,
    ...existingEnv,
  };

  // Write the merged environment variables to cypress.env.json
  fs.writeFileSync(
    cypressEnvPath,
    JSON.stringify(mergedEnv, null, 2) + '\n'
  );

  console.log('Created/updated cypress.env.json with default values');
  
  // Add cypress.env.json to .gitignore if not already present
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignore.includes('cypress.env.json')) {
      fs.appendFileSync(gitignorePath, '\n# Cypress environment variables\ncypress.env.json\n');
      console.log('Added cypress.env.json to .gitignore');
    }
  }

  // Create example file for reference
  fs.writeFileSync(
    path.join(process.cwd(), 'cypress.env.example.json'),
    JSON.stringify(defaultEnv, null, 2) + '\n'
  );
  console.log('Created cypress.env.example.json for reference');
}

function setupGitHubWorkflowSecrets() {
  const secretsPath = path.join(process.cwd(), '.github', 'workflows', 'set-secrets.sh');
  const secretsContent = `#!/bin/bash

# Script to set GitHub secrets for Cypress
# Run this script to set up required secrets in your GitHub repository

# Replace these values with your production values
CYPRESS_SUPABASE_URL="your-supabase-url"
CYPRESS_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Set the secrets using GitHub CLI
echo "Setting GitHub secrets..."
gh secret set CYPRESS_SUPABASE_URL --body "$CYPRESS_SUPABASE_URL"
gh secret set CYPRESS_SUPABASE_ANON_KEY --body "$CYPRESS_SUPABASE_ANON_KEY"

echo "GitHub secrets have been set successfully!"
`;

  if (!fs.existsSync(path.dirname(secretsPath))) {
    fs.mkdirSync(path.dirname(secretsPath), { recursive: true });
  }

  fs.writeFileSync(secretsPath, secretsContent);
  fs.chmodSync(secretsPath, '755');
  console.log('Created GitHub secrets setup script at .github/workflows/set-secrets.sh');
}

// Run the setup
try {
  createCypressEnvFile();
  setupGitHubWorkflowSecrets();
  console.log('\nSetup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Update cypress.env.json with your local environment values');
  console.log('2. Run .github/workflows/set-secrets.sh to configure GitHub secrets');
  console.log('3. Run npm run test:e2e to start Cypress tests');
} catch (error) {
  console.error('Error during setup:', error);
  process.exit(1);
}
