# React JWT Login System

A simple React (Vite) login system that demonstrates **Authentication, JWT, Token Generation,
Token Storage and Protected UI**.

## Run

```bash
npm install
npm run dev
```
Open the URL shown in the terminal (usually http://localhost:5173).

## Using it

1. Click **Create an account**, pick a username, password and role, then submit.
2. You are signed in straight away and see the Dashboard with your role.
3. Click **Logout**, then sign in again with the same username and password.

Accounts are saved in your browser's localStorage (simulated database), so they stay until you clear site data.

## How it works

| Requirement                          | Where                                   |
|--------------------------------------|-----------------------------------------|
| Username + password fields, Login btn| `src/components/Login.jsx`              |
| Sign up and authentication (salted SHA-256 hash) | `src/auth/users.js`      |
| Token generation (userId + role)     | `generateToken()` in `src/auth/jwt.js`  |
| Token storage                        | `localStorage` in `src/auth/AuthContext.jsx` |
| Display role after login             | `src/components/Dashboard.jsx`          |
| Protected dashboard                  | `src/components/ProtectedRoute.jsx`     |

### Flow
1. User creates an account (`registerUser()`) or logs in (`authenticate()`), simulating a server.
2. On success `generateToken({ userId, role })` builds `header.payload.signature`.
3. Token is saved in `localStorage` under the key `auth_token`.
4. `AuthContext` verifies the token (signature + expiry) and exposes `user`, `isLoggedIn`.
5. `ProtectedRoute` shows the Dashboard only if `isLoggedIn`; otherwise the Login form.
6. Logout removes the token. The token also expires automatically after 5 minutes.

> Note: This is a front-end simulation for learning. A real JWT is signed on the server with a
> secret key, and secrets must never live in browser code.
