import { getChatGPTUser } from "../app/chatgpt-auth";

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string) {
  return getAdminEmails().includes(email.toLowerCase());
}

export async function getAdminUser() {
  const user = await getChatGPTUser();
  return user && isAdminEmail(user.email) ? user : null;
}

export async function requireAdminApi() {
  const user = await getChatGPTUser();
  if (!user) {
    return { user: null, response: Response.json({ error: "로그인이 필요합니다." }, { status: 401 }) };
  }
  if (!isAdminEmail(user.email)) {
    return { user: null, response: Response.json({ error: "관리자 권한이 없습니다." }, { status: 403 }) };
  }
  return { user, response: null };
}
