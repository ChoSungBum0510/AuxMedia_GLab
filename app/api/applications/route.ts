import { and, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { ensureDatabase } from "../../../db/repository";
import { applications, courses } from "../../../db/schema";
import { isValidEmail, jsonError, readBoundedJson, textValue } from "../../../lib/http";

export async function POST(request: Request) {
  try {
    const body = await readBoundedJson(request);
    if (textValue(body.website, 200)) return Response.json({ ok: true }, { status: 201 });
    const courseSlug = textValue(body.courseSlug, 120);
    const region = textValue(body.region, 30);
    const name = textValue(body.name, 40);
    const email = textValue(body.email, 120).toLowerCase();
    const phone = textValue(body.phone, 30);
    const motivation = textValue(body.motivation, 1000);
    if (!courseSlug || !region || !name || !isValidEmail(email) || phone.length < 8 || body.consent !== true) {
      return jsonError("필수 입력값과 개인정보 동의를 확인해 주세요.", 400);
    }

    await ensureDatabase();
    const db = getDb();
    const available = await db.select({ slug: courses.slug }).from(courses).where(and(eq(courses.slug, courseSlug), eq(courses.region, region), eq(courses.status, "open"), eq(courses.published, true))).limit(1);
    if (!available.length) return jsonError("현재 신청할 수 없는 교육과정입니다.", 409);
    const existing = await db.select({ id: applications.id }).from(applications).where(and(eq(applications.courseSlug, courseSlug), eq(applications.email, email))).limit(1);
    if (existing.length) return jsonError("이미 같은 이메일로 신청한 과정입니다.", 409);
    const [application] = await db.insert(applications).values({ courseSlug, region, name, email, phone, motivation }).returning({ id: applications.id, status: applications.status });
    return Response.json({ application }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (message === "INVALID_BODY_SIZE" || message === "INVALID_JSON") return jsonError("요청 형식이 올바르지 않습니다.", 400);
    console.error(JSON.stringify({ message: "application creation failed", error: message }));
    return jsonError("신청 접수 중 문제가 발생했습니다.", 500);
  }
}
