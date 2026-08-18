# VoxVoyager

A React + Vite website and booking app for VoxVoyager, a Zimbabwe-based travel agency.

## What's included

- **Home, About, Services** — company overview and offerings
- **Trips** — upcoming departures with region/price filters, individual trip pages
- **Destinations** — places VoxVoyager operates in, local and international
- **Past Trips** — a gallery of completed departures
- **Accounts** — register/log in, then reserve a seat on any trip and manage bookings from a personal dashboard
- **Contact** — office details and a message form

## Backend: Supabase (Postgres + real auth)

Accounts and reservations are backed by [Supabase](https://supabase.com) — a
hosted Postgres database plus real authentication (hashed passwords,
sessions, optional email confirmation). Set it up once:

1. Create a free project at supabase.com.
2. Open **SQL Editor** in the Supabase dashboard, paste in the contents of
   `supabase/schema.sql`, and run it. This creates the `profiles` and
   `reservations` tables with Row Level Security so each user can only see
   their own data.
3. In **Project Settings > API**, copy your **Project URL** and **anon
   public key**.
4. Copy `.env.example` to `.env` and paste those two values in.
5. (Optional) In **Auth > Providers > Email**, turn "Confirm email" off if
   you want new accounts to be logged in immediately after signup instead
   of needing to click a confirmation link first. The app handles either
   setting — with confirmation on, users see a "check your inbox" screen
   after registering.

## Running it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

Never commit your `.env` file — it's already in `.gitignore`. The anon key
is safe to ship in frontend code (that's how Supabase is designed to work);
it only grants access within the limits of the Row Level Security policies
in `supabase/schema.sql`.

## What's still a prototype

- The contact form doesn't send anything — it just shows a confirmation.
  Wiring it up would mean adding a Supabase Edge Function or a service like
  Resend/SendGrid to actually deliver the message.
- Trip and destination data (`src/data/`) is static, not stored in the
  database. That's fine for a fixed set of scheduled departures; if you
  want to manage trips from an admin panel later, move that data into a
  Supabase `trips` table the same way reservations were moved.

## Project structure

```
src/
  lib/supabaseClient.js   Supabase client, reads env vars
  lib/storage.js          All auth + reservation calls go through here
  context/AuthContext.jsx React context wrapping storage.js for the app
  data/                   Static trip/destination content
  components/             Shared UI (Navbar, Footer, TicketCard, ...)
  pages/                  One file per route
supabase/schema.sql       Run this in the Supabase SQL Editor once
```

## Stack

React 19, React Router 7, Vite, plain CSS (no framework) — custom design
system defined in `src/index.css`. Supabase for auth and the database.
Photography from Unsplash.
