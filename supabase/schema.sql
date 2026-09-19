-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query)
-- after creating your project. Supabase Auth already provides auth.users,
-- so this only adds profile, content, and reservation tables.

-- 1. Profile info that isn't part of Supabase Auth's built-in user object.
DROP TABLE IF EXISTS profiles;

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  phone text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Automatically create a profile row whenever a new auth user signs up,
-- pulling name/phone out of the signUp() metadata.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'phone',
    false
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

--   UPDATE public.profiles
-- SET is_admin = true
-- WHERE id = 'YOUR_USER_ID';

-- 2. Reservations table.
create table public.reservations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  trip_id text not null,
  trip_title text not null,
  departure date not null,
  travelers integer not null check (travelers > 0),
  price_per_person numeric not null,
  total numeric not null,
  notes text,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz default now()
);

alter table public.reservations enable row level security;

create policy "Users can view their own reservations"
  on public.reservations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reservations"
  on public.reservations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reservations"
  on public.reservations for update
  using (auth.uid() = user_id);

-- 3. Trips (publicly viewable, editable only by admins)
create table public.trips (
  id text primary key,
  title text not null,
  region text not null,
  country text not null,
  departure date not null,
  duration text not null,
  price numeric not null,
  seats_left integer not null check (seats_left >= 0),
  difficulty text not null,
  image text,
  summary text not null,
  highlights text[] not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.trips enable row level security;

create policy "Anyone can view trips"
  on public.trips for select using (true);

create policy "Only admins can manage trips"
  on public.trips for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "Only admins can update trips"
  on public.trips for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "Only admins can delete trips"
  on public.trips for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- 4. Destinations (publicly viewable, editable only by admins)
create table public.destinations (
  id text primary key,
  name text not null,
  country text not null,
  region text not null,
  image text,
  blurb text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.destinations enable row level security;

create policy "Anyone can view destinations"
  on public.destinations for select using (true);

create policy "Only admins can manage destinations"
  on public.destinations for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "Only admins can update destinations"
  on public.destinations for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "Only admins can delete destinations"
  on public.destinations for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- 5. Past trips (publicly viewable, editable only by admins)
create table public.past_trips (
  id text primary key,
  title text not null,
  date text not null,
  country text not null,
  travelers integer not null,
  image text,
  story text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.past_trips enable row level security;

create policy "Anyone can view past trips"
  on public.past_trips for select using (true);

create policy "Only admins can manage past trips"
  on public.past_trips for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "Only admins can update past trips"
  on public.past_trips for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "Only admins can delete past trips"
  on public.past_trips for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );
