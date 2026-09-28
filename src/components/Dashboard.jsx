import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { decodeToken } from "../auth/jwt.js";

function useCountdown(exp) {
  const [left, setLeft] = useState(() => Math.max(exp - Math.floor(Date.now() / 1000), 0));
  useEffect(() => {
    const id = setInterval(
      () => setLeft(Math.max(exp - Math.floor(Date.now() / 1000), 0)),
      1000
    );
    return () => clearInterval(id);
  }, [exp]);
  return left;
}

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const decoded = decodeToken(token);
  const secondsLeft = useCountdown(user.exp);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const [h, p, s] = token.split(".");

  return (
    <div className="dashboard">
      <header className="topbar">
        <strong>Dashboard</strong>
        <div className="topbar-right">
          <span className={`role role-${user.role}`}>Role: {user.role}</span>
          <button className="btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="content">
        <h1>Welcome, {user.userId}</h1>
        <p className="muted">
          You can see this page because a valid token is stored in your browser.
        </p>

        <div className="grid">
          <section className="panel">
            <h2>Session</h2>
            <dl>
              <dt>User ID</dt>
              <dd>{user.userId}</dd>
              <dt>Role</dt>
              <dd>{user.role}</dd>
              <dt>Token expires in</dt>
              <dd>
                {mm}:{ss}
              </dd>
            </dl>
          </section>

          {/* Role-based protected UI */}
          {user.role === "admin" ? (
            <section className="panel">
              <h2>Admin tools</h2>
              <p>Only users with the admin role can see this panel.</p>
              <ul>
                <li>Manage users</li>
                <li>View system reports</li>
                <li>Change site settings</li>
              </ul>
            </section>
          ) : (
            <section className="panel">
              <h2>My courses</h2>
              <p>This panel is shown to the student role.</p>
              <ul>
                <li>Data Structures</li>
                <li>Machine Learning</li>
                <li>Web Development</li>
              </ul>
            </section>
          )}
        </div>

        <section className="panel">
          <h2>Your token (JWT)</h2>
          <p className="token" aria-label="Encoded token">
            <span className="tk-h">{h}</span>.<span className="tk-p">{p}</span>.
            <span className="tk-s">{s}</span>
          </p>
          <div className="decoded">
            <div>
              <h3>Header</h3>
              <pre>{JSON.stringify(decoded.header, null, 2)}</pre>
            </div>
            <div>
              <h3>Payload</h3>
              <pre>{JSON.stringify(decoded.payload, null, 2)}</pre>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
