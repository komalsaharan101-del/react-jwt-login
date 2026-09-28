import { useAuth } from "../auth/AuthContext.jsx";

/**
 * Protected UI: renders `children` only when the user is logged in.
 * Otherwise renders the `fallback` (the login form).
 */
export default function ProtectedRoute({ children, fallback }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : fallback;
}
