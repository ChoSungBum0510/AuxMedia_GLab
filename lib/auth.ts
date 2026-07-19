import { env } from "cloudflare:workers";
import { getCurrentUser } from "../app/auth";

export function getAdminEmails() {
  return (env.ADMIN_EMAILS ?? process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string) {
  return getAdminEmails().includes(email.toLowerCase());
}

export async function getAdminUser() {
  const user = await getCurrentUser();
  return user && user.role === "admin" && isAdminEmail(user.email) ? user : null;
}

export async function requireAdminApi() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, response: Response.json({ error: "로그인이 필요합니다." }, { status: 401 }) };
  }
  if (user.role !== "admin" || !isAdminEmail(user.email)) {
    return { user: null, response: Response.json({ error: "관리자 권한이 없습니다." }, { status: 403 }) };
  }
  return { user, response: null };
}
