import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { ROLES } from "../auth/users.js";

export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  function switchMode() {
    setMode(isSignup ? "login" : "signup");
    setError("");
    setPassword("");
    setConfirm("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Enter both a username and a password.");
      return;
    }
    if (isSignup && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) await register(username, password, role);
      else await login(username, password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <h1 id="login-title">{isSignup ? "Create account" : "Sign in"}</h1>
        <p className="muted">
          {isSignup
            ? "Choose a username and password to get started."
            : "Log in to receive a token and open your dashboard."}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isSignup && (
            <>
              <label htmlFor="confirm">Confirm password</label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />

              <label htmlFor="role">Role</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </>
          )}

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Create account" : "Login"}
          </button>
        </form>

        <p className="switch">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <button type="button" className="link" onClick={switchMode}>
            {isSignup ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </main>
  );
}
