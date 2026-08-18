-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query)
-- after creating your project. Supabase Auth already provides auth.users,
-- so this only adds a profile table (for name/phone) and the
-- reservations table.

-- 1. Profile info that isn't part of Supabase Auth's built-in user object.
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  phone text,
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
-- pulling name/phone out of the signUp() metadata (see supabaseClient usage).
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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

-- Each user can only see, create, and update their own reservations.
create policy "Users can view their own reservations"
  on public.reservations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reservations"
  on public.reservations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reservations"
  on public.reservations for update
  using (auth.uid() = user_id);
