import { env } from "cloudflare:workers";

export type SessionRole = "learner" | "admin";

export type SessionUser = {
  displayName: string;
  email: string;
  role: SessionRole;
};

type SessionPayload = SessionUser & {
  issuedAt: number;
  expiresAt: number;
};

export const SESSION_COOKIE_NAME = "__Host-glab_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;
const textEncoder = new TextEncoder();

function sessionSecret(): string {
  return (env as Env & { SESSION_SECRET?: string }).SESSION_SECRET ?? process.env.SESSION_SECRET ?? "";
}

function encodeBase64Url(value: Uint8Array): string {
  let binary = "";
  for (const byte of value) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

function decodeBase64Url(value: string): Uint8Array<ArrayBuffer> | null {
  try {
    const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0)) as Uint8Array<ArrayBuffer>;
  } catch {
    return null;
  }
}

async function hmacKey() {
  const secret = sessionSecret();
  if (secret.length < 32) return null;
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  const key = await hmacKey();
  if (!key) throw new Error("SESSION_SECRET is not configured.");

  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    ...user,
    email: user.email.trim().toLowerCase(),
    issuedAt: now,
    expiresAt: now + SESSION_DURATION_SECONDS,
  };
  const encodedPayload = encodeBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(encodedPayload));
  return `${encodedPayload}.${encodeBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  const [encodedPayload, encodedSignature, extra] = token.split(".");
  if (!encodedPayload || !encodedSignature || extra) return null;

  const key = await hmacKey();
  const signature = decodeBase64Url(encodedSignature);
  const payloadBytes = decodeBase64Url(encodedPayload);
  if (!key || !signature || !payloadBytes) return null;

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    textEncoder.encode(encodedPayload),
  );
  if (!valid) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as Partial<SessionPayload>;
    const now = Math.floor(Date.now() / 1000);
    if (
      typeof payload.displayName !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "learner" && payload.role !== "admin") ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= now
    ) return null;
    return {
      displayName: payload.displayName,
      email: payload.email.toLowerCase(),
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_DURATION_SECONDS}; HttpOnly; Secure; SameSite=Lax`;
}

export function clearedSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

export async function secureEqual(left: string, right: string): Promise<boolean> {
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", textEncoder.encode(left)),
    crypto.subtle.digest("SHA-256", textEncoder.encode(right)),
  ]);
  const leftBytes = new Uint8Array(leftHash);
  const rightBytes = new Uint8Array(rightHash);
  let difference = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }
  return difference === 0;
}
