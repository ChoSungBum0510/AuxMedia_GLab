import { getDb } from "../../../../db";
import { ensureDatabase } from "../../../../db/repository";
import { notices } from "../../../../db/schema";
import { requireAdminApi } from "../../../../lib/auth";
import { jsonError, readBoundedJson, textValue } from "../../../../lib/http";

const categories = new Set(["공지", "모집", "운영", "LMS"]);

export async function POST(request: Request) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  try {
    const body = await readBoundedJson(request);
    const title = textValue(body.title, 140);
    const category = textValue(body.category, 20);
    const content = textValue(body.content, 8000);
    if (!title || !categories.has(category) || content.length < 10) return jsonError("공지 제목, 분류와 내용을 확인해 주세요.", 400);
    await ensureDatabase();
    const [notice] = await getDb().insert(notices).values({ title, category, content, published: true }).returning();
    return Response.json({ notice }, { status: 201 });
  } catch (error) {
    console.error(JSON.stringify({ message: "notice creation failed", error: error instanceof Error ? error.message : "UNKNOWN" }));
    return jsonError("공지를 등록하지 못했습니다.", 500);
  }
}
