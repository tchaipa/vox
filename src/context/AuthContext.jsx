import { createContext, useContext, useEffect, useState } from "react";
import {
  createUser,
  verifyLogin,
  getSession,
  setSession,
  clearSession,
  getUsers,
} from "../lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sessionId = getSession();
    if (sessionId) {
      const found = getUsers().find((u) => u.id === sessionId);
      if (found) setUser(found);
    }
    setReady(true);
  }, []);

  function register({ name, email, password, phone }) {
    const newUser = createUser({ name, email, password, phone });
    setSession(newUser.id);
    setUser(newUser);
    return newUser;
  }

  function login(email, password) {
    const found = verifyLogin(email, password);
    setSession(found.id);
    setUser(found);
    return found;
  }

  function logout() {
    clearSession();
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
