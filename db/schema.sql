-- Feature 04 — Database Schema
-- Run via InsForge run-raw-sql. Source of truth for the schema; InsForge has no migration history of its own.

-- profiles ------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  location text,
  current_title text,
  experience_level text,
  years_experience integer,
  skills text[] not null default '{}',
  industries text[] not null default '{}',
  work_experience jsonb not null default '[]',
  education jsonb not null default '{}',
  job_titles_seeking text[] not null default '{}',
  remote_preference text,
  preferred_locations text[] not null default '{}',
  salary_expectation text,
  cover_letter_tone text,
  linkedin_url text,
  portfolio_url text,
  work_authorization text,
  resume_pdf_url text,
  is_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "own rows" on profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
  before update on profiles
  for each row
  execute function set_updated_at();

-- agent_runs ------------------------------------------------------------------
create table agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text,
  job_title_searched text,
  location_searched text,
  jobs_found integer,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index agent_runs_user_id_idx on agent_runs(user_id);

alter table agent_runs enable row level security;

create policy "own rows" on agent_runs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- jobs ------------------------------------------------------------------
create table jobs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references agent_runs(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null check (source in ('search', 'url')),
  source_url text,
  external_apply_url text,
  title text,
  company text,
  location text,
  salary text,
  job_type text,
  about_role text,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  nice_to_have text[] not null default '{}',
  benefits text[] not null default '{}',
  about_company text,
  match_score integer,
  match_reason text,
  matched_skills text[] not null default '{}',
  missing_skills text[] not null default '{}',
  company_research jsonb,
  found_at timestamptz not null default now()
);

create index jobs_user_id_idx on jobs(user_id);
create index jobs_run_id_idx on jobs(run_id);

alter table jobs enable row level security;

create policy "own rows" on jobs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- agent_logs ------------------------------------------------------------------
create table agent_logs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references agent_runs(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  message text,
  level text,
  job_id uuid references jobs(id) on delete set null,
  created_at timestamptz not null default now()
);

create index agent_logs_user_id_idx on agent_logs(user_id);
create index agent_logs_run_id_idx on agent_logs(run_id);
create index agent_logs_job_id_idx on agent_logs(job_id);

alter table agent_logs enable row level security;

create policy "own rows" on agent_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
