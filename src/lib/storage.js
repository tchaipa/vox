// Mock persistence layer. VoxVoyager has no backend yet, so accounts and
// reservations live in the browser's localStorage. This is fine for a demo
// or prototype, but it is NOT secure storage — passwords are stored in the
// clear on the visitor's own device and nothing here is shared between
// devices or visible to VoxVoyager staff. Swap this module out for real
// API calls once a backend exists; every other component only talks to
// the functions below, so that's the one file that needs to change.

const USERS_KEY = "vv_users";
const SESSION_KEY = "vv_session";
const RESERVATIONS_KEY = "vv_reservations";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() {
  return read(USERS_KEY, []);
}

export function findUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser({ name, email, password, phone }) {
  const users = getUsers();
  if (findUserByEmail(email)) {
    throw new Error("An account with that email already exists.");
  }
  const user = {
    id: `u_${Date.now()}`,
    name,
    email,
    phone: phone || "",
    password, // demo only — see file header
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  write(USERS_KEY, users);
  return user;
}

export function verifyLogin(email, password) {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error("Email or password is incorrect.");
  }
  return user;
}

export function getSession() {
  return read(SESSION_KEY, null);
}

export function setSession(userId) {
  write(SESSION_KEY, userId);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getReservations() {
  return read(RESERVATIONS_KEY, []);
}

export function getReservationsForUser(userId) {
  return getReservations().filter((r) => r.userId === userId);
}

export function createReservation(reservation) {
  const reservations = getReservations();
  const full = {
    id: `r_${Date.now()}`,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    ...reservation,
  };
  reservations.push(full);
  write(RESERVATIONS_KEY, reservations);
  return full;
}

export function cancelReservation(id) {
  const reservations = getReservations().map((r) =>
    r.id === id ? { ...r, status: "cancelled" } : r
  );
  write(RESERVATIONS_KEY, reservations);
}
