import type { Env } from "./types";

const cookieName = "cv_admin";
const encoder = new TextEncoder();
const sessionSeconds = 12 * 60 * 60;

async function sessionKey(secret: string) {
  const material = await crypto.subtle.digest("SHA-256", encoder.encode(`curation-vault-session-v1:${secret}`));
  return crypto.subtle.importKey("raw", material, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function base64Url(bytes: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

export function isConfigured(env: Env) {
  return !!env.DB && !!env.ADMIN_PASSWORD && env.ADMIN_PASSWORD.length >= 16;
}

export async function passwordMatches(candidate: string, secret: string) {
  const [candidateHash, secretHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(secret)),
  ]);
  const a = new Uint8Array(candidateHash);
  const b = new Uint8Array(secretHash);
  let difference = 0;
  for (let index = 0; index < a.length; index++) difference |= a[index] ^ b[index];
  return difference === 0;
}

export async function sessionCookie(secret: string, request: Request) {
  const expiry = Math.floor(Date.now() / 1000) + sessionSeconds;
  const payload = `v1.${expiry}`;
  const signature = base64Url(await crypto.subtle.sign("HMAC", await sessionKey(secret), encoder.encode(payload)));
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${cookieName}=${payload}.${signature}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${sessionSeconds}${secure}`;
}

export async function hasSession(request: Request, env: Env) {
  if (!isConfigured(env)) return false;
  const cookie = request.headers.get("Cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`));
  const token = cookie?.slice(cookieName.length + 1);
  if (!token) return false;
  const [version, expiryText, signature, extra] = token.split(".");
  const expiry = Number(expiryText);
  if (version !== "v1" || extra || !Number.isSafeInteger(expiry) || expiry <= Math.floor(Date.now() / 1000) || !signature) return false;
  try {
    return crypto.subtle.verify(
      "HMAC",
      await sessionKey(env.ADMIN_PASSWORD!),
      decodeBase64Url(signature),
      encoder.encode(`${version}.${expiryText}`)
    );
  } catch {
    return false;
  }
}
