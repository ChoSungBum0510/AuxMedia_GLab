import { getDb } from "../../../db";
import { ensureDatabase } from "../../../db/repository";
import { reviews } from "../../../db/schema";
import { jsonError, readBoundedJson, textValue } from "../../../lib/http";

export async function POST(request: Request) {
  try {
    const body = await readBoundedJson(request);
    if (textValue(body.website, 200)) return Response.json({ ok: true }, { status: 201 });
    const courseSlug = textValue(body.courseSlug, 120);
    const region = textValue(body.region, 30);
    const author = textValue(body.author, 40);
    const role = textValue(body.role, 50) || "수강생";
    const title = textValue(body.title, 100);
    const content = textValue(body.content, 1500);
    const rating = typeof body.rating === "number" ? Math.max(3, Math.min(5, Math.round(body.rating))) : 5;
    if (!courseSlug || !region || !author || !title || content.length < 10) return jsonError("후기 내용을 확인해 주세요.", 400);
    await ensureDatabase();
    const [review] = await getDb().insert(reviews).values({ courseSlug, region, author, role, rating, title, content, published: false }).returning({ id: reviews.id });
    return Response.json({ review, pending: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (message === "INVALID_BODY_SIZE" || message === "INVALID_JSON") return jsonError("요청 형식이 올바르지 않습니다.", 400);
    console.error(JSON.stringify({ message: "review creation failed", error: message }));
    return jsonError("후기 등록 중 문제가 발생했습니다.", 500);
  }
}
