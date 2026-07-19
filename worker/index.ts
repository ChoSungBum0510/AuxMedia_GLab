import handler from "vinext/server/app-router-entry";

function withSecurityHeaders(response: Response, request: Request): Response {
  const secured = new Response(response.body, response);
  secured.headers.set("X-Content-Type-Options", "nosniff");
  secured.headers.set("X-Frame-Options", "DENY");
  secured.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  secured.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  if (new URL(request.url).protocol === "https:") {
    secured.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  return secured;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const response = await handler.fetch(request, env, ctx);
      return withSecurityHeaders(response, request);
    } catch (error) {
      console.error(JSON.stringify({
        message: "unhandled worker request error",
        path: new URL(request.url).pathname,
        error: error instanceof Error ? error.message : "UNKNOWN",
      }));
      return withSecurityHeaders(new Response("일시적인 오류가 발생했습니다.", { status: 500 }), request);
    }
  },
};

export default worker;
