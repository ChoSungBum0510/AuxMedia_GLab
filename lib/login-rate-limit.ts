import { getRawDb } from "../db";
import { ensureDatabase } from "../db/repository";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 7;

async function identifierHash(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function recordLoginAttempt(request: Request, email: string, kind: string) {
  await ensureDatabase();
  const ip = request.headers.get("cf-connecting-ip") ?? "local";
  const key = await identifierHash(`${kind}:${email.toLowerCase()}:${ip}`);
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const db = getRawDb();

  await db.prepare(`INSERT INTO login_attempts (attempt_key, attempts, window_started_at, updated_at)
    VALUES (?1, 1, ?2, ?2)
    ON CONFLICT(attempt_key) DO UPDATE SET
      attempts = CASE WHEN window_started_at < ?3 THEN 1 ELSE attempts + 1 END,
      window_started_at = CASE WHEN window_started_at < ?3 THEN ?2 ELSE window_started_at END,
      updated_at = ?2`).bind(key, now, windowStart).run();

  const row = await db.prepare("SELECT attempts FROM login_attempts WHERE attempt_key = ?1").bind(key).first<{ attempts: number }>();
  return { allowed: (row?.attempts ?? MAX_ATTEMPTS + 1) <= MAX_ATTEMPTS, key };
}

export async function clearLoginAttempts(key: string) {
  await getRawDb().prepare("DELETE FROM login_attempts WHERE attempt_key = ?1").bind(key).run();
}

export function requestHasValidOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

