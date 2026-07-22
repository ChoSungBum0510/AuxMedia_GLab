import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "../../../db/repository";
import { fallbackCourseRecords, courseStatusLabel, getCourseDisplayInfo, LMS_URL, parseStringArray, regionMap, type RegionSlug } from "../../../lib/content";
import { RegionBadge } from "../../../components/RegionBadge";

export const dynamic = "force-dynamic";

async function resolveCourse(slug: string) {
  return getCourse(slug).catch(() => fallbackCourseRecords.find((course) => course.slug === slug) ?? null);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const course = await resolveCourse(slug);
  return course ? { title: course.title, description: course.summary } : { title: "교육과정" };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const course = await resolveCourse(slug); if (!course) notFound();
  const region = regionMap[course.region as RegionSlug]; const curriculum = parseStringArray(course.curriculum); const outcomes = parseStringArray(course.outcomes); const display = getCourseDisplayInfo(course);
  return (
    <><section className="course-detail-hero" style={{ "--region-color": region.color, "--region-pale": region.paleColor } as React.CSSProperties}><div className="shell course-detail-hero__inner"><div><RegionBadge region={region} /><div className="course-detail-tags"><span className={`status status--${course.status}`}>{courseStatusLabel(course.status)}</span><span>{course.category}</span><span>{course.format}</span></div><h1>{course.title}</h1><p>{course.summary}</p></div><aside><span>모집 안내</span><strong>{display.application}</strong><small>{display.participation}</small>{course.status === "open" ? <Link className="button button--wide" href={`/apply/${course.slug}`}>이 교육 신청하기</Link> : <Link className="button button--wide" href="/notices">알림마당 확인하기</Link>}{course.platformUrl && <a className="course-platform-link" href={course.platformUrl} target="_blank" rel="noreferrer">교육 플랫폼 바로가기 <span aria-hidden="true">↗</span></a>}</aside></div></section>
      <section className="course-quick-info"><div className="shell"><dl><div><dt>교육 일정</dt><dd>{display.schedule}</dd></div><div><dt>교육 장소</dt><dd>{course.location}</dd></div><div><dt>교육 대상</dt><dd>{course.audience}</dd></div><div><dt>운영 방식</dt><dd>{course.format}</dd></div></dl></div></section>
      <section className="section"><div className="shell course-content-layout"><article><span className="eyebrow">CURRICULUM</span><h2>무엇을 배우나요?</h2><ol className="curriculum-list">{curriculum.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{index + 1}단계</small><strong>{item}</strong></div></li>)}</ol></article><aside className="course-outcomes"><span className="eyebrow">WHAT YOU GET</span><h2>과정에서 얻게 되는 것</h2><ul>{outcomes.map((outcome) => <li key={outcome}><span>✓</span>{outcome}</li>)}</ul><div className="lms-note"><strong>온라인 복습은 통합 LMS에서</strong><p>강의자료, 학습 진도, 과제와 수료 현황을 이어서 관리합니다.</p><a href={LMS_URL} target="_blank" rel="noreferrer">LMS 미리보기 ↗</a></div></aside></div></section>
      <section className="course-final-cta" style={{ "--region-color": region.color } as React.CSSProperties}><div className="shell"><div><span>{region.displayName}</span><h2>단회성 체험에서<br />지속형 배움으로.</h2></div><div><p>운영 안내: {region.contact}</p>{course.status === "open" ? <Link className="button button--white" href={`/apply/${course.slug}`}>지금 신청하기 →</Link> : <Link className="button button--white" href="/notices">새 일정 확인하기 →</Link>}</div></div></section></>
  );
}
