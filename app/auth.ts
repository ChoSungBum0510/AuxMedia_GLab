import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken, type SessionUser } from "../lib/session";

export type CurrentUser = SessionUser;

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function requireCurrentUser(returnTo: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (user) return user;
  redirect(signInPath(returnTo));
}

export function signInPath(returnTo: string, mode?: "learner" | "admin"): string {
  const params = new URLSearchParams({ returnTo: safeReturnPath(returnTo) });
  if (mode) params.set("mode", mode);
  return `/login?${params.toString()}`;
}

export function signOutPath(returnTo = "/"): string {
  return `/api/auth/logout?returnTo=${encodeURIComponent(safeReturnPath(returnTo))}`;
}

export function safeReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  try {
    const url = new URL(value, "https://glab.local");
    if (url.origin !== "https://glab.local" || url.pathname.startsWith("/api/auth")) return "/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

