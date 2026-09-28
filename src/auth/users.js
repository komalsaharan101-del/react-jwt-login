/**
 * Simulated user database, stored in the browser's localStorage.
 * In a real app this is a database on the server.
 * Passwords are never stored as plain text: we save a salted SHA-256 hash.
 */
const USERS_KEY = "app_users";

export const ROLES = ["student", "admin"];

const loadUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(salt + password);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms)); // fake network delay

/** Creates a new account. Throws if the username is taken or input is invalid. */
export async function registerUser(username, password, role) {
  await wait(400);
  const name = username.trim();

  if (name.length < 3) throw new Error("Username must be at least 3 characters.");
  if (password.length < 6) throw new Error("Password must be at least 6 characters.");
  if (!ROLES.includes(role)) throw new Error("Choose a valid role.");

  const users = loadUsers();
  if (users.some((u) => u.username.toLowerCase() === name.toLowerCase())) {
    throw new Error("That username is already taken. Choose another one.");
  }

  const salt = crypto.randomUUID();
  const user = {
    userId: "U" + Date.now().toString(36).toUpperCase(),
    username: name,
    role,
    salt,
    passwordHash: await hashPassword(password, salt),
  };
  saveUsers([...users, user]);
  return { userId: user.userId, role: user.role };
}

/** Checks credentials. Resolves with { userId, role } or throws an error. */
export async function authenticate(username, password) {
  await wait(400);
  const user = loadUsers().find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase()
  );
  if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
    throw new Error("Incorrect username or password.");
  }
  return { userId: user.userId, role: user.role };
}
