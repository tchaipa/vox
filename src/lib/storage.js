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
  const message = error?.message || "Something went wrong. Please try again.";

  if (message.toLowerCase().includes("email rate limit exceeded")) {
    return new Error(
      "Too many sign-up attempts. Please wait a minute and try again, or use a different email address.",
    );
  }

  return new Error(message);
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw mapAuthError(error);
  const profile = await fetchProfile(data.user.id);
  return toAppUser(data.user, profile);
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw mapAuthError(error);
}

export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;
  const profile = await fetchProfile(session.user.id);
  return toAppUser(session.user, profile);
}

// Fires on sign-in, sign-out, and token refresh so the UI stays in sync
// across tabs. Returns an unsubscribe function.
export function onAuthChange(callback) {
  const { data: listener } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      if (!session) {
        callback(null);
        return;
      }
      const profile = await fetchProfile(session.user.id);
      callback(toAppUser(session.user, profile));
    },
  );
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

export async function createReservation({
  userId,
  tripId,
  tripTitle,
  departure,
  travelers,
  pricePerPerson,
  total,
  notes,
}) {
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

// ========== ADMIN OPERATIONS ==========

// Check if current user is admin
export async function isCurrentUserAdmin() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return false;
  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .single();
  if (error) return false;
  return data?.is_admin || false;
}

// ========== TRIPS ADMIN ==========

export async function getAllTrips() {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("departure", { ascending: true });
  if (error) throw mapAuthError(error);
  return data.map(fromDbTrip);
}

export async function getTripByIdFromDb(tripId) {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();
  if (error) throw mapAuthError(error);
  return fromDbTrip(data);
}

export async function createTrip(trip) {
  const { data, error } = await supabase
    .from("trips")
    .insert({
      id: trip.id,
      title: trip.title,
      region: trip.region,
      country: trip.country,
      departure: trip.departure,
      duration: trip.duration,
      price: trip.price,
      seats_left: trip.seatsLeft,
      difficulty: trip.difficulty,
      image: trip.image,
      summary: trip.summary,
      highlights: trip.highlights,
    })
    .select()
    .single();
  if (error) throw mapAuthError(error);
  return fromDbTrip(data);
}

export async function updateTrip(tripId, updates) {
  const { data, error } = await supabase
    .from("trips")
    .update({
      title: updates.title,
      region: updates.region,
      country: updates.country,
      departure: updates.departure,
      duration: updates.duration,
      price: updates.price,
      seats_left: updates.seatsLeft,
      difficulty: updates.difficulty,
      image: updates.image,
      summary: updates.summary,
      highlights: updates.highlights,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tripId)
    .select()
    .single();
  if (error) throw mapAuthError(error);
  return fromDbTrip(data);
}

export async function deleteTrip(tripId) {
  const { error } = await supabase.from("trips").delete().eq("id", tripId);
  if (error) throw mapAuthError(error);
}

function fromDbTrip(row) {
  return {
    id: row.id,
    title: row.title,
    region: row.region,
    country: row.country,
    departure: row.departure,
    duration: row.duration,
    price: row.price,
    seatsLeft: row.seats_left,
    difficulty: row.difficulty,
    image: row.image,
    summary: row.summary,
    highlights: row.highlights,
  };
}

// ========== DESTINATIONS ADMIN ==========

export async function getAllDestinations() {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw mapAuthError(error);
  return data.map(fromDbDestination);
}

export async function getDestinationByIdFromDb(destId) {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("id", destId)
    .single();
  if (error) throw mapAuthError(error);
  return fromDbDestination(data);
}

export async function createDestination(dest) {
  const { data, error } = await supabase
    .from("destinations")
    .insert({
      id: dest.id,
      name: dest.name,
      country: dest.country,
      region: dest.region,
      image: dest.image,
      blurb: dest.blurb,
    })
    .select()
    .single();
  if (error) throw mapAuthError(error);
  return fromDbDestination(data);
}

export async function updateDestination(destId, updates) {
  const { data, error } = await supabase
    .from("destinations")
    .update({
      name: updates.name,
      country: updates.country,
      region: updates.region,
      image: updates.image,
      blurb: updates.blurb,
      updated_at: new Date().toISOString(),
    })
    .eq("id", destId)
    .select()
    .single();
  if (error) throw mapAuthError(error);
  return fromDbDestination(data);
}

export async function deleteDestination(destId) {
  const { error } = await supabase
    .from("destinations")
    .delete()
    .eq("id", destId);
  if (error) throw mapAuthError(error);
}

function fromDbDestination(row) {
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    region: row.region,
    image: row.image,
    blurb: row.blurb,
  };
}

// ========== PAST TRIPS ADMIN ==========

export async function getAllPastTrips() {
  const { data, error } = await supabase
    .from("past_trips")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw mapAuthError(error);
  return data.map(fromDbPastTrip);
}

export async function getPastTripByIdFromDb(tripId) {
  const { data, error } = await supabase
    .from("past_trips")
    .select("*")
    .eq("id", tripId)
    .single();
  if (error) throw mapAuthError(error);
  return fromDbPastTrip(data);
}

export async function createPastTrip(trip) {
  const { data, error } = await supabase
    .from("past_trips")
    .insert({
      id: trip.id,
      title: trip.title,
      date: trip.date,
      country: trip.country,
      travelers: trip.travelers,
      image: trip.image,
      story: trip.story,
    })
    .select()
    .single();
  if (error) throw mapAuthError(error);
  return fromDbPastTrip(data);
}

export async function updatePastTrip(tripId, updates) {
  const { data, error } = await supabase
    .from("past_trips")
    .update({
      title: updates.title,
      date: updates.date,
      country: updates.country,
      travelers: updates.travelers,
      image: updates.image,
      story: updates.story,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tripId)
    .select()
    .single();
  if (error) throw mapAuthError(error);
  return fromDbPastTrip(data);
}

export async function deletePastTrip(tripId) {
  const { error } = await supabase.from("past_trips").delete().eq("id", tripId);
  if (error) throw mapAuthError(error);
}

function fromDbPastTrip(row) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    country: row.country,
    travelers: row.travelers,
    image: row.image,
    story: row.story,
  };
}
