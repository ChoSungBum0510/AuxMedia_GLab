import { findApplicantIdentity } from "../../../../../db/repository";
import { isValidEmail, jsonError, readBoundedJson, textValue } from "../../../../../lib/http";
import { clearLoginAttempts, recordLoginAttempt, requestHasValidOrigin } from "../../../../../lib/login-rate-limit";
import { createSessionToken, sessionCookie } from "../../../../../lib/session";

export async function POST(request: Request) {
  if (!requestHasValidOrigin(request)) return jsonError("허용되지 않은 요청입니다.", 403);
  try {
    const body = await readBoundedJson(request);
    const email = textValue(body.email, 120).toLowerCase();
    const phone = textValue(body.phone, 30);
    if (!isValidEmail(email) || phone.replace(/\D/gu, "").length < 8) return jsonError("이메일과 연락처를 확인해 주세요.", 400);

    const rateLimit = await recordLoginAttempt(request, email, "learner");
    if (!rateLimit.allowed) return jsonError("로그인 시도가 너무 많습니다. 15분 뒤 다시 시도해 주세요.", 429);

    const applicant = await findApplicantIdentity(email, phone);
    if (!applicant) return jsonError("일치하는 교육 신청내역을 찾지 못했습니다.", 401);

    const token = await createSessionToken({ displayName: applicant.name, email, role: "learner" });
    await clearLoginAttempts(rateLimit.key);
    return Response.json({ ok: true }, { headers: { "Set-Cookie": sessionCookie(token), "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    console.error(JSON.stringify({ message: "learner login failed", error: message }));
    return jsonError("로그인 처리 중 문제가 발생했습니다.", 500);
  }
}

