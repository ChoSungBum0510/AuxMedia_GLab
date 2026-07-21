import type { Metadata } from "next";
import { CourseExplorer } from "../../components/CourseExplorer";
import { listCourses } from "../../db/repository";
import { fallbackCourseRecords } from "../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "교육과정", description: "정선·동해·인제 GLab의 운영 과정과 예정 교육을 확인하세요." };

const availableRegions = new Set(["jeongseon", "donghae", "inje"]);

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ region?: string }> }) {
  const { region } = await searchParams;
  const initialRegion = region && availableRegions.has(region) ? region : "all";
  const courses = await listCourses().catch(() => fallbackCourseRecords);
  return (
    <><section className="page-hero page-hero--courses"><div className="shell"><span className="eyebrow eyebrow--light">G-LAB PROGRAMS</span><h1>기초부터 프로젝트까지,<br />이어지는 교육을 한곳에서.</h1><p>정선·동해의 운영 과정과 예정 교육을 지역·분야별로 살펴보세요.</p></div></section><section className="section course-list-section"><div className="shell"><CourseExplorer courses={courses} initialRegion={initialRegion} /></div></section></>
  );
}
