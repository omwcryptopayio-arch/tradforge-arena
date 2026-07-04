-- ============ ROLES ============
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "self read roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());
create policy "admin manage roles" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ============ ATTEMPTS ============
create table public.certification_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  chapter_id text not null default 'ch1',
  level text not null check (level in ('standard','high','premium')),
  scenario_id text not null,
  scenario_index int not null default 1,
  direction text,
  correct boolean not null default false,
  score int not null default 0,
  duration_ms int not null default 0,
  overtime_ms int not null default 0,
  opened_card_ids jsonb not null default '[]'::jsonb,
  efficiency int,
  essential_found int,
  essential_total int,
  coherence int,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.certification_attempts to authenticated;
grant all on public.certification_attempts to service_role;
alter table public.certification_attempts enable row level security;
create policy "self read attempts" on public.certification_attempts
  for select to authenticated using (user_id = auth.uid());
create policy "self insert attempts" on public.certification_attempts
  for insert to authenticated with check (user_id = auth.uid());
create policy "self update attempts" on public.certification_attempts
  for update to authenticated using (user_id = auth.uid());
create policy "self delete attempts" on public.certification_attempts
  for delete to authenticated using (user_id = auth.uid());
create index idx_attempts_user_level on public.certification_attempts (user_id, chapter_id, level);

-- ============ CARD INTERACTIONS ============
create table public.certification_card_interactions (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references public.certification_attempts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade not null,
  scenario_id text not null,
  card_id text not null,
  opened_at_ms int not null default 0,
  duration_ms int not null default 0,
  reopens int not null default 0,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.certification_card_interactions to authenticated;
grant all on public.certification_card_interactions to service_role;
alter table public.certification_card_interactions enable row level security;
create policy "self read card int" on public.certification_card_interactions
  for select to authenticated using (user_id = auth.uid());
create policy "self insert card int" on public.certification_card_interactions
  for insert to authenticated with check (user_id = auth.uid());
create index idx_cardint_user on public.certification_card_interactions (user_id, scenario_id);

-- ============ REASONING ============
create table public.certification_reasoning (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references public.certification_attempts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade not null,
  scenario_id text not null,
  items jsonb not null default '[]'::jsonb,
  bias text,
  free_text text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.certification_reasoning to authenticated;
grant all on public.certification_reasoning to service_role;
alter table public.certification_reasoning enable row level security;
create policy "self read reasoning" on public.certification_reasoning
  for select to authenticated using (user_id = auth.uid());
create policy "self insert reasoning" on public.certification_reasoning
  for insert to authenticated with check (user_id = auth.uid());

-- ============ PROGRESS ============
create table public.certification_progress (
  user_id uuid references auth.users(id) on delete cascade not null,
  chapter_id text not null default 'ch1',
  level text not null,
  passed boolean not null default false,
  best_score int not null default 0,
  completed int not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, chapter_id, level)
);
grant select, insert, update, delete on public.certification_progress to authenticated;
grant all on public.certification_progress to service_role;
alter table public.certification_progress enable row level security;
create policy "self read progress" on public.certification_progress
  for select to authenticated using (user_id = auth.uid());
create policy "self write progress" on public.certification_progress
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============ DECISION JOURNAL ============
create table public.decision_journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  attempt_id uuid references public.certification_attempts(id) on delete cascade,
  chapter_id text not null default 'ch1',
  scenario_id text not null,
  level text not null,
  title text not null,
  symbol text not null,
  direction text not null,
  correct boolean not null default false,
  coherence int not null default 0,
  efficiency int not null default 0,
  reasoning jsonb not null default '[]'::jsonb,
  bias text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.decision_journal_entries to authenticated;
grant all on public.decision_journal_entries to service_role;
alter table public.decision_journal_entries enable row level security;
create policy "self full journal" on public.decision_journal_entries
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create index idx_journal_user on public.decision_journal_entries (user_id, created_at desc);

-- ============ CERTIFICATES ============
create table public.certificates_issued (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  chapter_id text not null default 'ch1',
  candidate_name text not null,
  levels jsonb not null default '[]'::jsonb,
  aggregate_score int not null default 0,
  hash text unique not null,
  issued_at timestamptz not null default now()
);
grant select, insert, update, delete on public.certificates_issued to authenticated;
grant all on public.certificates_issued to service_role;
alter table public.certificates_issued enable row level security;
create policy "self read certs" on public.certificates_issued
  for select to authenticated using (user_id = auth.uid());
create policy "self insert certs" on public.certificates_issued
  for insert to authenticated with check (user_id = auth.uid());
create policy "self update certs" on public.certificates_issued
  for update to authenticated using (user_id = auth.uid());