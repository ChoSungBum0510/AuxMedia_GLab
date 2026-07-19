import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test, { after, before } from "node:test";

const port = 41927;
const origin = `http://127.0.0.1:${port}`;
let server;
let serverOutput = "";

before(async () => {
  server = spawn(process.execPath, ["node_modules/wrangler/bin/wrangler.js", "dev", "--config", "tests/wrangler.test.jsonc", "--ip", "127.0.0.1", "--port", String(port)], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, WRANGLER_LOG_PATH: ".wrangler/wrangler.log" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (chunk) => { serverOutput += chunk; });
  server.stderr.on("data", (chunk) => { serverOutput += chunk; });

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(origin, { redirect: "manual" });
      if (response.status) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw new Error(`Cloudflare Worker test server did not start:\n${serverOutput}`);
});

after(() => {
  server?.kill("SIGTERM");
});

async function render(path = "/") {
  return fetch(`${origin}${path}`, { headers: { accept: "text/html" } });
}

test("server-renders the GLab homepage with core navigation", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /GLab \| 지역교육 통합지원 플랫폼/);
  assert.match(html, /정선/);
  assert.match(html, /동해/);
  assert.match(html, /인제/);
  assert.match(html, /\/brand\/hallym-glab\.png/);
  assert.match(html, /\/brand\/gangwon-map-clean\.png/);
  assert.match(html, /\/brand\/glab-jeongseon\.png/);
  assert.match(html, /\/brand\/glab-donghae\.png/);
  assert.match(html, /\/brand\/glab-inje\.png/);
  assert.match(html, /href="\/regions\/jeongseon"/);
  assert.match(html, /href="\/regions\/donghae"/);
  assert.match(html, /href="\/regions\/inje"/);
  assert.match(html, /map-region-shape--jeongseon/);
  assert.match(html, /map-region-shape--donghae/);
  assert.match(html, /map-region-shape--inje/);
  assert.doesNotMatch(html, /G:Lab|M Campus|엠 캠퍼스|chatgpt/i);
  assert.match(html, /통합 LMS 바로가기/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
});

test("renders platform-independent login and all regional detail routes", async () => {
  const login = await render("/login?returnTo=%2Fmypage");
  assert.equal(login.status, 200);
  const loginHtml = await login.text();
  assert.match(loginHtml, /나의 신청내역 확인/);
  assert.match(loginHtml, /관리자/);
  assert.doesNotMatch(loginHtml, /chatgpt/i);

  for (const region of ["jeongseon", "donghae", "inje"]) {
    const response = await render(`/regions/${region}`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(`/brand/glab-${region}\\.png`));
  }
});

test("rejects invalid administrator credentials", async () => {
  const response = await fetch(`${origin}/api/auth/login/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ email: "admin@example.com", password: "incorrect-password-value" }),
  });
  assert.equal(response.status, 401);
  assert.doesNotMatch(response.headers.get("set-cookie") ?? "", /glab_session/);
});

test("server-renders the public course directory", async () => {
  const response = await render("/courses");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /내게 맞는 지역교육/);
  assert.match(html, /교육과정 또는 관심 분야를 검색하세요/);
});
