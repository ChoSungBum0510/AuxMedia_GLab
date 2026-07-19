import type { Metadata } from "next";
import { CourseExplorer } from "../../components/CourseExplorer";
import { listCourses } from "../../db/repository";
import { fallbackCourseRecords } from "../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "교육과정", description: "정선·동해·인제 GLab의 교육과정을 검색하고 신청하세요." };

const availableRegions = new Set(["jeongseon", "donghae", "inje"]);

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ region?: string }> }) {
  const { region } = await searchParams;
  const initialRegion = region && availableRegions.has(region) ? region : "all";
  const courses = await listCourses().catch(() => fallbackCourseRecords);
  return (
    <><section className="page-hero page-hero--courses"><div className="shell"><span className="eyebrow eyebrow--light">ALL PROGRAMS</span><h1>내게 맞는 지역교육을<br />한곳에서 찾아보세요.</h1><p>지역, 관심 분야, 모집 상태를 비교하고 교육 상세 정보와 신청까지 이어집니다.</p></div></section><section className="section course-list-section"><div className="shell"><CourseExplorer courses={courses} initialRegion={initialRegion} /></div></section></>
  );
}
