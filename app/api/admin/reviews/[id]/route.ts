import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { ensureDatabase } from "../../../../../db/repository";
import { reviews } from "../../../../../db/schema";
import { requireAdminApi } from "../../../../../lib/auth";
import { jsonError, readBoundedJson } from "../../../../../lib/http";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  try {
    const { id } = await params; const numericId = Number(id); const body = await readBoundedJson(request);
    if (!Number.isInteger(numericId) || typeof body.published !== "boolean") return jsonError("요청값을 확인해 주세요.", 400);
    await ensureDatabase(); await getDb().update(reviews).set({ published: body.published }).where(eq(reviews.id, numericId));
    return Response.json({ ok: true });
  } catch (error) {
    console.error(JSON.stringify({ message: "review update failed", error: error instanceof Error ? error.message : "UNKNOWN" }));
    return jsonError("후기 상태를 저장하지 못했습니다.", 500);
  }
}
