import { createContext, useContext, useEffect, useState } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  onAuthChange,
} from "../lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((found) => {
        if (active) setUser(found);
      })
      .finally(() => {
        if (active) setReady(true);
      });

    const unsubscribe = onAuthChange((updatedUser) => {
      if (active) setUser(updatedUser);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function register({ name, email, password, phone }) {
    const { user: newUser, needsEmailConfirmation } = await registerUser({
      name,
      email,
      password,
      phone,
    });
    if (!needsEmailConfirmation) setUser(newUser);
    return { user: newUser, needsEmailConfirmation };
  }

  async function login(email, password) {
    const found = await loginUser(email, password);
    setUser(found);
    return found;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
