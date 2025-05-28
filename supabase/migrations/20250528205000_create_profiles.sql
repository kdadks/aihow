-- Create profiles table (up)
create table public.profiles (
    id uuid references auth.users(id) primary key,
    username text unique,
    full_name text,
    avatar_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view any profile"
    on public.profiles for select
    using (true);

create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- Create trigger for updated_at
create or replace function handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger profiles_updated_at
    before update on public.profiles
    for each row
    execute function handle_updated_at();

-- Rollback
-- ROLLBACK SQL:
/*
drop trigger if exists profiles_updated_at on public.profiles;
drop function if exists handle_updated_at();
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can view any profile" on public.profiles;
drop table if exists public.profiles;
*/