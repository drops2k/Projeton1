-- Projeton1: secure Supabase foundation
-- Apply in Supabase SQL Editor after reviewing. This does NOT enable real-money transfers.
-- Admins must be granted manually by a trusted project owner; never let users self-promote.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'support')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table if not exists public.financial_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  provider text not null default 'demo',
  provider_account_id text,
  currency char(3) not null default 'BRL',
  status text not null default 'pending' check (status in ('pending','active','blocked','closed')),
  created_at timestamptz not null default now(),
  unique (provider, provider_account_id)
);

-- Store amounts as integer cents. Balances should be derived from provider-confirmed ledger entries,
-- not edited by the browser or by a general admin form.
create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.financial_accounts(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  provider text not null default 'demo',
  provider_transaction_id text,
  idempotency_key text,
  entry_type text not null check (entry_type in ('credit','debit','fee','reversal')),
  amount_cents bigint not null check (amount_cents > 0),
  currency char(3) not null default 'BRL',
  status text not null default 'pending' check (status in ('pending','processing','confirmed','failed','cancelled','reversed')),
  description text,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unique (provider, provider_transaction_id),
  unique (user_id, idempotency_key)
);

create index if not exists financial_accounts_user_id_idx on public.financial_accounts(user_id);
create index if not exists ledger_entries_user_created_idx on public.ledger_entries(user_id, created_at desc);
create index if not exists ledger_entries_account_created_idx on public.ledger_entries(account_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.financial_accounts enable row level security;
alter table public.ledger_entries enable row level security;

-- Helper: only trusted server-side code should change roles. Users can only read their own role rows.
drop policy if exists "read own roles" on public.user_roles;
create policy "read own roles" on public.user_roles
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile" on public.profiles
  for insert to authenticated with check (id = (select auth.uid()));
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "read own financial accounts" on public.financial_accounts;
create policy "read own financial accounts" on public.financial_accounts
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "read own ledger entries" on public.ledger_entries;
create policy "read own ledger entries" on public.ledger_entries
  for select to authenticated using (user_id = (select auth.uid()));

-- Intentionally no client INSERT/UPDATE/DELETE policies for roles, accounts, or ledger entries.
-- Provision accounts and record financial state only from trusted Edge Functions after provider confirmation.
-- Never expose SUPABASE_SERVICE_ROLE_KEY or provider API secrets to Vite/browser code.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant initial administrator manually after the owner has signed in once:
-- 1) Find the owner's UUID in Supabase Authentication > Users.
-- 2) Replace OWNER_AUTH_UUID below and run this one statement in SQL Editor:
-- insert into public.user_roles (user_id, role) values ('OWNER_AUTH_UUID', 'admin')
-- on conflict do nothing;
-- Do not add a public RPC that lets a user assign their own role.
