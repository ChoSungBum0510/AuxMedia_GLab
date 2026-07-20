import { env } from "cloudflare:workers";
import { isAdminEmail } from "../../../../../lib/auth";
import { isValidEmail, jsonError, readBoundedJson, textValue } from "../../../../../lib/http";
import { clearLoginAttempts, recordLoginAttempt, requestHasValidOrigin } from "../../../../../lib/login-rate-limit";
import { createSessionToken, secureEqual, sessionCookie } from "../../../../../lib/session";

export async function POST(request: Request) {
  if (!requestHasValidOrigin(request)) return jsonError("허용되지 않은 요청입니다.", 403);
  try {
    const body = await readBoundedJson(request);
    const email = textValue(body.email, 120).toLowerCase();
    const password = textValue(body.password, 200);
    if (!isValidEmail(email) || password.length < 12) return jsonError("이메일과 비밀번호를 확인해 주세요.", 400);

    const rateLimit = await recordLoginAttempt(request, email, "admin");
    if (!rateLimit.allowed) return jsonError("로그인 시도가 너무 많습니다. 15분 뒤 다시 시도해 주세요.", 429);
    const configuredPassword = (env as Env & { ADMIN_PASSWORD?: string }).ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? "";
    const accepted = isAdminEmail(email) && configuredPassword.length >= 16 && await secureEqual(password, configuredPassword);
    if (!accepted) return jsonError("관리자 계정 정보가 올바르지 않습니다.", 401);

    const token = await createSessionToken({ displayName: "GLab 담당자", email, role: "admin" });
    await clearLoginAttempts(rateLimit.key);
    return Response.json({ ok: true }, { headers: { "Set-Cookie": sessionCookie(token), "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    console.error(JSON.stringify({ message: "admin login failed", error: message }));
    return jsonError("로그인 처리 중 문제가 발생했습니다.", 500);
  }
}
