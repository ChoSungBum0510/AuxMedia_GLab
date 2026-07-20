import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationForm } from "../../../components/ApplicationForm";
import { RegionBadge } from "../../../components/RegionBadge";
import { getCourse } from "../../../db/repository";
import { fallbackCourseRecords, formatDate, regionMap, type RegionSlug } from "../../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "교육 신청" };

export default async function ApplyPage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = await getCourse(courseSlug).catch(() => fallbackCourseRecords.find((item) => item.slug === courseSlug) ?? null);
  if (!course) notFound();
  const region = regionMap[course.region as RegionSlug];
  if (course.status !== "open") return <section className="section"><div className="shell empty-state"><strong>현재 신청할 수 없는 과정입니다.</strong><p>모집 일정을 확인하거나 다른 교육과정을 살펴보세요.</p><Link href="/courses" className="button">교육과정 보기</Link></div></section>;

  return (
    <section className="apply-page"><div className="shell apply-layout"><aside className="apply-summary" style={{ "--region-color": region.color } as React.CSSProperties}><RegionBadge region={region} dark /><span className="eyebrow">PROGRAM APPLICATION</span><h1>{course.title}</h1><p>{course.summary}</p><dl><div><dt>신청 마감</dt><dd>{formatDate(course.applicationEnd)}</dd></div><div><dt>교육 기간</dt><dd>{formatDate(course.courseStart)}<br />— {formatDate(course.courseEnd)}</dd></div><div><dt>장소</dt><dd>{course.location}</dd></div><div><dt>정원</dt><dd>{course.capacity}명</dd></div></dl><Link href={`/courses/${course.slug}`} className="text-link">과정 상세로 돌아가기 →</Link></aside><div className="apply-form-panel"><div><span className="eyebrow">APPLY NOW</span><h2>교육 신청 정보</h2><p>접수 후 지역 GLab 담당자가 선발 및 교육 안내를 드립니다.</p></div><ApplicationForm course={{ slug: course.slug, title: course.title, region: course.region }} /></div></div></section>
  );
}
