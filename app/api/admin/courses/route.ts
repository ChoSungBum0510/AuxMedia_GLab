import { getDb } from "../../../../db";
import { ensureDatabase } from "../../../../db/repository";
import { courses } from "../../../../db/schema";
import { parseAdminCourseInput } from "../../../../lib/admin-course-input";
import { requireAdminApi } from "../../../../lib/auth";
import { jsonError, readBoundedJson } from "../../../../lib/http";

export async function POST(request: Request) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  try {
    const body = await readBoundedJson(request);
    const parsed = parseAdminCourseInput(body);
    if (!parsed.ok) return jsonError(parsed.error, 400);
    const courseData = parsed.data;
    const slug = `${courseData.region}-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8)}`;
    await ensureDatabase();
    const [course] = await getDb().insert(courses).values({ slug, ...courseData, curriculum: "[]", outcomes: "[]", published: true }).returning();
    return Response.json({ course }, { status: 201 });
  } catch (error) {
    console.error(JSON.stringify({ message: "course creation failed", error: error instanceof Error ? error.message : "UNKNOWN" }));
    return jsonError("과정을 등록하지 못했습니다.", 500);
  }
}
