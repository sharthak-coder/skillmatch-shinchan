-- ==============================================================================
-- SkillMatch (Crayon Shin-chan Theme) Database Migration & Schema
-- Supabase Postgres + Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  bio text default '',
  avatar_url text default '',
  year text default 'Junior',
  major text default 'Computer Science',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SKILLS LOOKUP TABLE
create table if not exists public.skills (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PROFILE_SKILLS JUNCTION
create table if not exists public.profile_skills (
  profile_id uuid references public.profiles(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete cascade,
  primary key (profile_id, skill_id)
);

-- 4. INTERESTS LOOKUP TABLE
create table if not exists public.interests (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. PROFILE_INTERESTS JUNCTION
create table if not exists public.profile_interests (
  profile_id uuid references public.profiles(id) on delete cascade,
  interest_id uuid references public.interests(id) on delete cascade,
  primary key (profile_id, interest_id)
);

-- 6. PROJECTS TABLE
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  team_size integer default 4 check (team_size > 0),
  status text default 'open' check (status in ('open', 'closed')),
  category text default 'AI & ML',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. PROJECT_SKILLS JUNCTION
create table if not exists public.project_skills (
  project_id uuid references public.projects(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete cascade,
  primary key (project_id, skill_id)
);

-- 8. JOIN_REQUESTS TABLE
create table if not exists public.join_requests (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  message text default '',
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (project_id, requester_id)
);

-- Indexes for lightning fast lookups
create index if not exists idx_projects_owner on public.projects(owner_id);
create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_join_requests_project on public.join_requests(project_id);
create index if not exists idx_join_requests_requester on public.join_requests(requester_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.profile_skills enable row level security;
alter table public.interests enable row level security;
alter table public.profile_interests enable row level security;
alter table public.projects enable row level security;
alter table public.project_skills enable row level security;
alter table public.join_requests enable row level security;

-- PROFILES
-- Anyone authenticated can view all profiles
create policy "Profiles viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- Also allow public read for portfolio showcase
create policy "Profiles viewable by anon"
  on public.profiles for select
  to anon
  using (true);

-- Users can insert and update their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- SKILLS & INTERESTS (Publicly readable, authenticated can insert new)
create policy "Skills readable by all"
  on public.skills for select
  using (true);

create policy "Skills insertable by authenticated"
  on public.skills for insert
  to authenticated
  with check (true);

create policy "Interests readable by all"
  on public.interests for select
  using (true);

create policy "Interests insertable by authenticated"
  on public.interests for insert
  to authenticated
  with check (true);

-- PROFILE_SKILLS & PROFILE_INTERESTS
create policy "Profile skills viewable by all"
  on public.profile_skills for select
  using (true);

create policy "Profile skills manageable by owner"
  on public.profile_skills for all
  to authenticated
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create policy "Profile interests viewable by all"
  on public.profile_interests for select
  using (true);

create policy "Profile interests manageable by owner"
  on public.profile_interests for all
  to authenticated
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- PROJECTS
create policy "Projects readable by all"
  on public.projects for select
  using (true);

create policy "Projects creatable by authenticated"
  on public.projects for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "Projects editable by owner only"
  on public.projects for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Projects deletable by owner only"
  on public.projects for delete
  to authenticated
  using (auth.uid() = owner_id);

-- PROJECT_SKILLS
create policy "Project skills readable by all"
  on public.project_skills for select
  using (true);

create policy "Project skills manageable by project owner"
  on public.project_skills for all
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_skills.project_id
      and projects.owner_id = auth.uid()
    )
  );

-- JOIN_REQUESTS
-- Requester can view own requests; Project owner can view requests for their projects
create policy "View join requests"
  on public.join_requests for select
  to authenticated
  using (
    requester_id = auth.uid()
    or exists (
      select 1 from public.projects
      where projects.id = join_requests.project_id
      and projects.owner_id = auth.uid()
    )
  );

-- Requesters can insert their own request
create policy "Insert join request"
  on public.join_requests for insert
  to authenticated
  with check (auth.uid() = requester_id);

-- Only project owners can update join request status (accept/reject)
create policy "Update join request status by project owner"
  on public.join_requests for update
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = join_requests.project_id
      and projects.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects
      where projects.id = join_requests.project_id
      and projects.owner_id = auth.uid()
    )
  );

-- Requester can delete/withdraw their own pending request
create policy "Delete own join request"
  on public.join_requests for delete
  to authenticated
  using (requester_id = auth.uid());

-- ==============================================================================
-- TRIGGER FOR USER SIGNUP
-- Automatically creates a profile record when a new user signs up in auth.users
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, bio, avatar_url, year, major)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'Ready to build something legendary with the Kasukabe Defense Corps!',
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id),
    'Sophomore',
    'Computer Science'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- INITIAL SEED LOOKUP VALUES
-- ==============================================================================
insert into public.skills (name) values
  ('react'), ('typescript'), ('next.js'), ('python'), ('pytorch'),
  ('tailwind css'), ('node.js'), ('fastapi'), ('figma'), ('ui/ux design'),
  ('rust'), ('solidity'), ('postgresql'), ('graphql'), ('docker'),
  ('c++'), ('three.js'), ('framer motion'), ('opencv'), ('aws')
on conflict (name) do nothing;

insert into public.interests (name) values
  ('ai & machine learning'), ('fintech & web3'), ('edtech & study tools'),
  ('climate & sustainability'), ('game development'), ('hardware & robotics'),
  ('social & community'), ('healthtech & wellness'), ('open source tooling')
on conflict (name) do nothing;
