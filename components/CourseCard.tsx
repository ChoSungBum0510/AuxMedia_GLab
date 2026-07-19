import Link from "next/link";
import { courseStatusLabel, formatDate, regionMap, type RegionSlug } from "../lib/content";
import type { CourseRecord } from "../db/schema";
import { RegionBadge } from "./RegionBadge";

export function CourseCard({ course, featured = false }: { course: CourseRecord; featured?: boolean }) {
  const region = regionMap[course.region as RegionSlug];
  if (!region) return null;

  return (
    <article className={`course-card${featured ? " course-card--featured" : ""}`}>
      <div className="course-card__top">
        <RegionBadge region={region} compact />
        <span className={`status status--${course.status}`}>{courseStatusLabel(course.status)}</span>
      </div>
      <div className="course-card__body">
        <div className="course-card__tags"><span>{course.category}</span><span>{course.format}</span></div>
        <h3><Link href={`/courses/${course.slug}`}>{course.title}</Link></h3>
        <p>{course.summary}</p>
      </div>
      <dl className="course-card__meta">
        <div><dt>접수</dt><dd>{formatDate(course.applicationEnd)}까지</dd></div>
        <div><dt>교육</dt><dd>{formatDate(course.courseStart)} 시작</dd></div>
        <div><dt>정원</dt><dd>{course.capacity}명</dd></div>
      </dl>
      <div className="course-card__actions">
        <Link href={`/courses/${course.slug}`} className="text-link">과정 자세히 보기 <span>→</span></Link>
        {course.status === "open" && <Link href={`/apply/${course.slug}`} className="button button--small">신청하기</Link>}
      </div>
    </article>
  );
}
