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
  assert.doesNotMatch(html, /G:Lab|M Campus|엠 캠퍼스/i);
  assert.match(html, /통합 LMS 바로가기/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-renders the public course directory", async () => {
  const response = await render("/courses");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /내게 맞는 지역교육/);
  assert.match(html, /교육과정 또는 관심 분야를 검색하세요/);
});
