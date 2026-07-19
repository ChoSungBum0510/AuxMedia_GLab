const MAX_JSON_BYTES = 32_768;

export async function readBoundedJson(request: Request): Promise<Record<string, unknown>> {
  const length = Number(request.headers.get("content-length"));
  if (!Number.isFinite(length) || length <= 0 || length > MAX_JSON_BYTES) {
    throw new Error("INVALID_BODY_SIZE");
  }
  const value: unknown = await request.json();
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("INVALID_JSON");
  return value as Record<string, unknown>;
}

export function textValue(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 120;
}

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}
