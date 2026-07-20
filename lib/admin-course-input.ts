import { textValue } from "./http";

const regions = new Set(["jeongseon", "donghae", "inje"]);
const statuses = new Set(["open", "planned", "closed"]);
const datePattern = /^\d{4}-\d{2}-\d{2}$/u;

export type AdminCourseInput = {
  title: string;
  region: string;
  status: string;
  summary: string;
  category: string;
  format: string;
  audience: string;
  location: string;
  applicationStart: string;
  applicationEnd: string;
  courseStart: string;
  courseEnd: string;
  capacity: number;
};

export function parseAdminCourseInput(body: Record<string, unknown>): { ok: true; data: AdminCourseInput } | { ok: false; error: string } {
  const data: AdminCourseInput = {
    title: textValue(body.title, 120),
    region: textValue(body.region, 30),
    status: textValue(body.status, 20),
    summary: textValue(body.summary, 1000),
    category: textValue(body.category, 60),
    format: textValue(body.format, 60),
    audience: textValue(body.audience, 100),
    location: textValue(body.location, 150),
    applicationStart: textValue(body.applicationStart, 10),
    applicationEnd: textValue(body.applicationEnd, 10),
    courseStart: textValue(body.courseStart, 10),
    courseEnd: textValue(body.courseEnd, 10),
    capacity: Number(body.capacity),
  };
  if (
    !data.title || !data.summary || !data.category || !data.format || !data.audience || !data.location ||
    !regions.has(data.region) || !statuses.has(data.status) ||
    !datePattern.test(data.applicationStart) || !datePattern.test(data.applicationEnd) ||
    !datePattern.test(data.courseStart) || !datePattern.test(data.courseEnd) ||
    !Number.isInteger(data.capacity) || data.capacity < 1 || data.capacity > 500
  ) {
    return { ok: false, error: "필수 과정 정보를 확인해 주세요." };
  }
  if (data.applicationStart > data.applicationEnd || data.courseStart > data.courseEnd) {
    return { ok: false, error: "접수 및 교육 기간의 시작일과 종료일을 확인해 주세요." };
  }
  return { ok: true, data };
}
