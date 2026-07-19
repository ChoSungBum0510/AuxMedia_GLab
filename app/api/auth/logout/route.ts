import { clearedSessionCookie } from "../../../../lib/session";
import { safeReturnPath } from "../../../auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const destination = new URL(safeReturnPath(url.searchParams.get("returnTo")), url.origin);
  return new Response(null, {
    status: 303,
    headers: {
      Location: destination.toString(),
      "Set-Cookie": clearedSessionCookie(),
      "Cache-Control": "no-store",
    },
  });
}

