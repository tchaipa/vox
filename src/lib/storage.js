// Real persistence layer backed by Supabase (Postgres + Auth).
// Every function is async now, since it talks to a network API — the old
// localStorage version was synchronous, so components calling these had to
// be updated to await them / handle loading state.
//
// Auth (signup, login, sessions, password hashing) is handled entirely by
// Supabase Auth. "Users" here are auth.users rows; name/phone live in a
// separate `profiles` table (see supabase/schema.sql) since Supabase Auth
// doesn't store arbitrary custom fields on the user record itself.

import { supabase } from "./supabaseClient";

function mapAuthError(error) {
  // Supabase's raw error messages are fine to show as-is for the common cases.
  return new Error(error?.message || "Something went wrong. Please try again.");
}

export async function registerUser({ name, email, password, phone }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone: phone || null }, // read by the handle_new_user() trigger
    },
  });
  if (error) throw mapAuthError(error);
  // If your Supabase project has "Confirm email" turned on (Auth > Providers
  // > Email), data.session is null here until the user clicks the emailed
  // link — they aren't logged in yet even though the account now exists.
  return {
    user: toAppUser(data.user, { name, phone }),
    needsEmailConfirmation: !data.session,
  };
}

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw mapAuthError(error);
  const profile = await fetchProfile(data.user.id);
  return toAppUser(data.user, profile);
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw mapAuthError(error);
}

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const profile = await fetchProfile(session.user.id);
  return toAppUser(session.user, profile);
}

// Fires on sign-in, sign-out, and token refresh so the UI stays in sync
// across tabs. Returns an unsubscribe function.
export function onAuthChange(callback) {
  const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session) {
      callback(null);
      return;
    }
    const profile = await fetchProfile(session.user.id);
    callback(toAppUser(session.user, profile));
  });
  return () => listener.subscription.unsubscribe();
}

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("name, phone")
    .eq("id", userId)
    .single();
  if (error) return { name: "", phone: "" }; // profile row may not have landed yet
  return data;
}

function toAppUser(authUser, profile) {
  return {
    id: authUser.id,
    email: authUser.email,
    name: profile?.name || "",
    phone: profile?.phone || "",
  };
}

export async function getReservationsForUser(userId) {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("user_id", userId)
    .order("departure", { ascending: true });
  if (error) throw mapAuthError(error);
  return data.map(fromDbReservation);
}

export async function createReservation({ userId, tripId, tripTitle, departure, travelers, pricePerPerson, total, notes }) {
  const { data, error } = await supabase
    .from("reservations")
    .insert({
      user_id: userId,
      trip_id: tripId,
      trip_title: tripTitle,
      departure,
      travelers,
      price_per_person: pricePerPerson,
      total,
      notes: notes || null,
    })
    .select()
    .single();
  if (error) throw mapAuthError(error);
  return fromDbReservation(data);
}

export async function cancelReservation(id) {
  const { error } = await supabase
    .from("reservations")
    .update({ status: "cancelled" })
    .eq("id", id);
  if (error) throw mapAuthError(error);
}

function fromDbReservation(row) {
  return {
    id: row.id,
    userId: row.user_id,
    tripId: row.trip_id,
    tripTitle: row.trip_title,
    departure: row.departure,
    travelers: row.travelers,
    pricePerPerson: row.price_per_person,
    total: row.total,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
  };
}
