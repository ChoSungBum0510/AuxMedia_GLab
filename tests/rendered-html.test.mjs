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
  assert.match(html, /href="\/about"/);
  assert.match(html, /map-region-shape--jeongseon/);
  assert.match(html, /map-region-shape--donghae/);
  assert.match(html, /map-region-shape--inje/);
  assert.doesNotMatch(html, /map-pin__dot|map-pin__pulse/);
  assert.doesNotMatch(html, /G:Lab|M Campus|엠 캠퍼스|chatgpt/i);
  assert.match(html, /통합 LMS 바로가기/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
});

test("renders the GLab introduction page with the promotional video", async () => {
  const response = await render("/about");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /영상으로 만나는/);
  assert.match(html, /youtube-nocookie\.com\/embed\/zRnJ9bulKv0/);
  assert.match(html, /지역의 질문이 배움이 되고/);
  assert.match(html, /href="\/regions\/jeongseon"/);
  assert.match(html, /href="\/courses"/);
  assert.doesNotMatch(html, /M Campus|엠 캠퍼스|chatgpt/i);
});

test("renders platform-independent login and all regional detail routes", async () => {
  const login = await render("/login?returnTo=%2Fmypage");
  assert.equal(login.status, 200);
  const loginHtml = await login.text();
  assert.match(loginHtml, /나의 신청내역 확인/);
  assert.match(loginHtml, /담당자/);
  assert.doesNotMatch(loginHtml, /chatgpt/i);

  for (const region of ["jeongseon", "donghae", "inje"]) {
    const response = await render(`/regions/${region}`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(`/brand/glab-${region}\\.png`));
  }
});

test("renders a clickable, searchable notice board and notice detail", async () => {
  const response = await render("/notices");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /공지 분류/);
  assert.match(html, /검색어를 입력하세요/);
  assert.match(html, /href="\/notices\/1"/);

  const detail = await render("/notices/1");
  assert.equal(detail.status, 200);
  const detailHtml = await detail.text();
  assert.match(detailHtml, /정선·동해·인제 8월 교육과정 통합 모집 안내/);
  assert.match(detailHtml, /알림마당 목록/);
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

test("gives the operator real notice and course create/edit permissions", async () => {
  const login = await fetch(`${origin}/api/auth/login/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ email: "admin@example.com", password: "test-admin-password-is-long-enough" }),
  });
  assert.equal(login.status, 200);
  const cookie = (login.headers.get("set-cookie") ?? "").split(";")[0];
  assert.match(cookie, /glab_session=/);

  const admin = await fetch(`${origin}/admin`, { headers: { Cookie: cookie, accept: "text/html" } });
  assert.equal(admin.status, 200);
  const adminHtml = await admin.text();
  assert.match(adminHtml, /담당자 운영 대시보드/);
  assert.match(adminHtml, /공지 관리/);
  assert.match(adminHtml, /교육과정 관리/);

  const createNotice = await fetch(`${origin}/api/admin/notices`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ category: "운영", title: "담당자 기능 검증 공지", content: "담당자 계정의 공지 등록과 수정 권한을 검증하는 내용입니다." }),
  });
  assert.equal(createNotice.status, 201);
  const { notice } = await createNotice.json();
  assert.ok(notice?.id);

  const updateNotice = await fetch(`${origin}/api/admin/notices/${notice.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ category: "공지", title: "담당자 기능 검증 공지 수정", content: "담당자 계정으로 공지 본문과 제목을 정상적으로 수정했습니다." }),
  });
  assert.equal(updateNotice.status, 200);
  assert.equal((await updateNotice.json()).notice.title, "담당자 기능 검증 공지 수정");

  const coursePayload = {
    title: "담당자 과정 관리 검증",
    region: "inje",
    status: "planned",
    category: "운영 검증",
    format: "오프라인 + LMS",
    applicationStart: "2026-08-01",
    applicationEnd: "2026-08-15",
    courseStart: "2026-08-20",
    courseEnd: "2026-09-10",
    capacity: "20",
    audience: "지역 주민",
    location: "인제 G-Lab",
    summary: "담당자가 교육과정을 추가하고 수정할 수 있는지 검증하는 과정입니다.",
  };
  const createCourse = await fetch(`${origin}/api/admin/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify(coursePayload),
  });
  assert.equal(createCourse.status, 201);
  const { course } = await createCourse.json();
  assert.ok(course?.id);

  const updateCourse = await fetch(`${origin}/api/admin/courses/${course.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ ...coursePayload, title: "담당자 과정 관리 검증 수정" }),
  });
  assert.equal(updateCourse.status, 200);
  assert.equal((await updateCourse.json()).course.title, "담당자 과정 관리 검증 수정");
});
