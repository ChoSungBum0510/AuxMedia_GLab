import type { Metadata } from "next";
import { CourseExplorer } from "../../components/CourseExplorer";
import { listCourses } from "../../db/repository";
import { fallbackCourseRecords } from "../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "교육과정", description: "공식 자료로 확인된 정선·동해·인제 GLab의 운영·예정 교육을 확인하세요." };

const availableRegions = new Set(["jeongseon", "donghae", "inje"]);

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ region?: string }> }) {
  const { region } = await searchParams;
  const initialRegion = region && availableRegions.has(region) ? region : "all";
  const courses = await listCourses().catch(() => fallbackCourseRecords);
  return (
    <><section className="page-hero page-hero--courses"><div className="shell"><span className="eyebrow eyebrow--light">VERIFIED PROGRAMS</span><h1>실제 운영 성과와<br />다음 교육을 한곳에서.</h1><p>공식 운영자료로 확인된 정선·동해 프로그램과 확정된 예정 교육을 지역·분야별로 살펴보세요.</p></div></section><section className="section course-list-section"><div className="shell"><CourseExplorer courses={courses} initialRegion={initialRegion} /></div></section></>
  );
}
