import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authenticate, registerUser } from "./users.js";
import { generateToken, verifyToken } from "./jwt.js";

const TOKEN_KEY = "auth_token"; // key used in localStorage
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Restore the session on page refresh: read token from storage and verify it.
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved && verifyToken(saved)) return saved;
    localStorage.removeItem(TOKEN_KEY);
    return null;
  });

  const user = useMemo(() => (token ? verifyToken(token) : null), [token]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const login = useCallback(async (username, password) => {
    const found = await authenticate(username, password); // throws on failure
    const newToken = generateToken(found);                  // create JWT
    localStorage.setItem(TOKEN_KEY, newToken);              // store token
    setToken(newToken);
  }, []);

  const register = useCallback(async (username, password, role) => {
    const created = await registerUser(username, password, role); // throws on failure
    const newToken = generateToken(created);                       // sign in right away
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  // Auto-logout when the token expires.
  useEffect(() => {
    if (!user) return;
    const msLeft = user.exp * 1000 - Date.now();
    const timer = setTimeout(logout, Math.max(msLeft, 0));
    return () => clearTimeout(timer);
  }, [user, logout]);

  const value = { token, user, isLoggedIn: Boolean(user), login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
