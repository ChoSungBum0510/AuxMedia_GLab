import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { ensureDatabase } from "../../../../../db/repository";
import { applications } from "../../../../../db/schema";
import { requireAdminApi } from "../../../../../lib/auth";
import { jsonError, readBoundedJson, textValue } from "../../../../../lib/http";

const allowedStatuses = new Set(["received", "reviewing", "accepted", "rejected", "cancelled"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  try {
    const { id } = await params; const numericId = Number(id); const body = await readBoundedJson(request); const status = textValue(body.status, 20);
    if (!Number.isInteger(numericId) || !allowedStatuses.has(status)) return jsonError("올바르지 않은 상태값입니다.", 400);
    await ensureDatabase();
    await getDb().update(applications).set({ status, updatedAt: new Date().toISOString() }).where(eq(applications.id, numericId));
    return Response.json({ ok: true });
  } catch (error) {
    console.error(JSON.stringify({ message: "application status update failed", error: error instanceof Error ? error.message : "UNKNOWN" }));
    return jsonError("상태를 저장하지 못했습니다.", 500);
  }
}
