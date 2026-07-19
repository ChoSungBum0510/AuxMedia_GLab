import { getDb } from "../../../../db";
import { ensureDatabase } from "../../../../db/repository";
import { courses } from "../../../../db/schema";
import { requireAdminApi } from "../../../../lib/auth";
import { jsonError, readBoundedJson, textValue } from "../../../../lib/http";

const regions = new Set(["jeongseon", "donghae", "inje"]);
const statuses = new Set(["open", "planned", "closed"]);

export async function POST(request: Request) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  try {
    const body = await readBoundedJson(request);
    const title = textValue(body.title, 120); const region = textValue(body.region, 30); const status = textValue(body.status, 20);
    const summary = textValue(body.summary, 1000); const category = textValue(body.category, 60); const format = textValue(body.format, 60);
    const audience = textValue(body.audience, 100); const location = textValue(body.location, 150);
    const applicationStart = textValue(body.applicationStart, 10); const applicationEnd = textValue(body.applicationEnd, 10);
    const courseStart = textValue(body.courseStart, 10); const courseEnd = textValue(body.courseEnd, 10);
    const capacity = Math.max(1, Math.min(500, Number(body.capacity) || 20));
    if (!title || !summary || !category || !format || !audience || !location || !regions.has(region) || !statuses.has(status) || !applicationStart || !applicationEnd || !courseStart || !courseEnd) return jsonError("필수 과정 정보를 확인해 주세요.", 400);
    const slug = `${region}-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8)}`;
    await ensureDatabase();
    const [course] = await getDb().insert(courses).values({ slug, title, region, status, summary, category, format, audience, location, applicationStart, applicationEnd, courseStart, courseEnd, capacity, curriculum: "[]", outcomes: "[]", published: true }).returning();
    return Response.json({ course }, { status: 201 });
  } catch (error) {
    console.error(JSON.stringify({ message: "course creation failed", error: error instanceof Error ? error.message : "UNKNOWN" }));
    return jsonError("과정을 등록하지 못했습니다.", 500);
  }
}
