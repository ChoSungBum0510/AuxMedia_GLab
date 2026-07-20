import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { ensureDatabase } from "../../../../../db/repository";
import { courses } from "../../../../../db/schema";
import { parseAdminCourseInput } from "../../../../../lib/admin-course-input";
import { requireAdminApi } from "../../../../../lib/auth";
import { jsonError, readBoundedJson } from "../../../../../lib/http";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  try {
    const { id } = await params; const numericId = Number(id); const body = await readBoundedJson(request);
    if (!Number.isInteger(numericId) || numericId < 1) return jsonError("요청값을 확인해 주세요.", 400);
    const isVisibilityOnly = Object.keys(body).length === 1 && typeof body.published === "boolean";
    let update;
    if (isVisibilityOnly) {
      update = { published: body.published as boolean, updatedAt: new Date().toISOString() };
    } else {
      const parsed = parseAdminCourseInput(body);
      if (!parsed.ok) return jsonError(parsed.error, 400);
      update = { ...parsed.data, updatedAt: new Date().toISOString() };
    }
    await ensureDatabase();
    const [course] = await getDb().update(courses).set(update).where(eq(courses.id, numericId)).returning();
    if (!course) return jsonError("교육과정을 찾을 수 없습니다.", 404);
    return Response.json({ course });
  } catch (error) {
    console.error(JSON.stringify({ message: "course update failed", error: error instanceof Error ? error.message : "UNKNOWN" }));
    return jsonError("과정 상태를 저장하지 못했습니다.", 500);
  }
}
