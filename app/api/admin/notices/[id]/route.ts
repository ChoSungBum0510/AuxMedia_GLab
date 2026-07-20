import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { ensureDatabase } from "../../../../../db/repository";
import { notices } from "../../../../../db/schema";
import { requireAdminApi } from "../../../../../lib/auth";
import { jsonError, readBoundedJson, textValue } from "../../../../../lib/http";

const categories = new Set(["공지", "모집", "운영", "LMS"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  try {
    const { id } = await params;
    const numericId = Number(id);
    const body = await readBoundedJson(request);
    if (!Number.isInteger(numericId) || numericId < 1) return jsonError("요청값을 확인해 주세요.", 400);

    const isVisibilityOnly = Object.keys(body).length === 1 && typeof body.published === "boolean";
    let update: { title?: string; category?: string; content?: string; published?: boolean };
    if (isVisibilityOnly) {
      update = { published: body.published as boolean };
    } else {
      const title = textValue(body.title, 140);
      const category = textValue(body.category, 20);
      const content = textValue(body.content, 8000);
      if (!title || !categories.has(category) || content.length < 10) return jsonError("공지 제목, 분류와 내용을 확인해 주세요.", 400);
      update = { title, category, content };
    }

    await ensureDatabase();
    const [notice] = await getDb().update(notices).set(update).where(eq(notices.id, numericId)).returning();
    if (!notice) return jsonError("공지를 찾을 수 없습니다.", 404);
    return Response.json({ notice });
  } catch (error) {
    console.error(JSON.stringify({ message: "notice update failed", error: error instanceof Error ? error.message : "UNKNOWN" }));
    return jsonError("공지를 저장하지 못했습니다.", 500);
  }
}
