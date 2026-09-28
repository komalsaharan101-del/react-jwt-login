/**
 * Simulated JWT helpers (frontend only, for learning).
 *
 * A JWT has 3 parts:  HEADER.PAYLOAD.SIGNATURE   (each Base64URL encoded)
 *   - header    : algorithm + token type
 *   - payload   : the claims (here: userId, role, iat, exp)
 *   - signature : proves the token was not modified
 *
 * In a real app the SERVER signs the token with a secret key.
 * Here we fake the signature so you can see the full flow.
 */

const SECRET = "demo-secret-do-not-use-in-production";
export const TOKEN_LIFETIME_SECONDS = 60 * 5; // token expires after 5 minutes

// --- Base64URL helpers -------------------------------------------------
const toBase64Url = (obj) =>
  btoa(JSON.stringify(obj))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromBase64Url = (str) => {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
};

// --- Fake signature (simple hash, NOT real cryptography) ---------------
const fakeSign = (data) => {
  let hash = 0;
  const input = data + SECRET;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
};

// --- Token generation ----------------------------------------------------
export function generateToken({ userId, role }) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = { userId, role, iat: now, exp: now + TOKEN_LIFETIME_SECONDS };

  const unsigned = `${toBase64Url(header)}.${toBase64Url(payload)}`;
  return `${unsigned}.${fakeSign(unsigned)}`;
}

// --- Token decoding + validation ----------------------------------------
export function decodeToken(token) {
  try {
    const [h, p] = token.split(".");
    return { header: fromBase64Url(h), payload: fromBase64Url(p) };
  } catch {
    return null;
  }
}

/** Returns the payload if the token is valid and not expired, otherwise null. */
export function verifyToken(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [h, p, signature] = parts;
  if (fakeSign(`${h}.${p}`) !== signature) return null; // tampered

  const decoded = decodeToken(token);
  if (!decoded) return null;

  const now = Math.floor(Date.now() / 1000);
  if (decoded.payload.exp <= now) return null; // expired

  return decoded.payload;
}
