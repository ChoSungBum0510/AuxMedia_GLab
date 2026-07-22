import Link from "next/link";
import { CourseCard } from "../components/CourseCard";
import { RegionMap } from "../components/RegionMap";
import { SectionHeading } from "../components/SectionHeading";
import { BrandLogo } from "../components/BrandLogo";
import { RegionBadge } from "../components/RegionBadge";
import { fallbackCourseRecords, fallbackNotices, fallbackReviews, getCourseDisplayInfo, LMS_URL, regionMap, regions, type RegionSlug } from "../lib/content";
import { listCourses, listPublishedNotices, listPublishedReviews } from "../db/repository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [courses, reviews, notices] = await Promise.all([
    listCourses().catch(() => fallbackCourseRecords),
    listPublishedReviews().catch(() => fallbackReviews),
    listPublishedNotices().catch(() => fallbackNotices),
  ]);
  const featuredCourses = courses.filter((course) => course.status !== "closed").slice(0, 3);

  return (
    <>
      <section className="home-hero">
        <div className="home-hero__image" aria-hidden="true" />
        <div className="home-hero__shade" aria-hidden="true" />
        <div className="home-hero__content shell">
          <span className="hero-kicker">HALLYM REGIONAL INNOVATION PLATFORM</span>
          <h1>지역이 변하는 순간,<br /><span className="home-hero__brand-line"><BrandLogo className="official-brand--hero" dark /><span>이 함께합니다.</span></span></h1>
          <p>정선·동해·인제 G-Lab과 강릉 M Campus가 지역의 수요와 한림대학교의 역량을 연결하는 교육·연구·협력 활동을 한곳에서 만나보세요.</p>
          <div className="hero-actions">
            <Link className="button button--white" href="#regional-map">지역 교육 찾기 <span>↓</span></Link>
            <Link className="button button--glass" href="/courses">교육·활동 보기 <span>→</span></Link>
          </div>
        </div>
        <div className="hero-region-bar">
          <div className="shell">
            {regions.map((region, index) => (
              <Link key={region.slug} href={`/regions/${region.slug}`}>
                <span className="hero-region-bar__index">0{index + 1}</span><RegionBadge region={region} compact dark /><b>↗</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="intro-strip">
        <div className="shell intro-strip__inner">
          <div><span className="eyebrow">ONE GLAB PLATFORM</span><h2>지속형 교육체계로<br />전환하는 첫 시작.</h2></div>
          <p>과정 안내와 신청, 일정, 참여·수료 성과를 통합하고 기초·심화·프로젝트 학습이 끊김 없이 이어지게 합니다.</p>
          <div className="intro-metrics">
            <div><strong>4</strong><span>지역 교육 거점</span></div>
            <div><strong>28H</strong><span>동해 AI 미디어</span></div>
            <div><strong>42H</strong><span>정선 청소년 드론</span></div>
          </div>
        </div>
      </section>

      <section className="map-section section" id="regional-map">
        <div className="shell">
          <SectionHeading eyebrow="REGIONAL HUBS ACROSS GANGWON" title="지도로 만나는 지역 교육 거점" description="정선·동해·인제 G-Lab과 강릉 M Campus를 선택해 교육과정과 활동을 확인하세요." />
          <RegionMap />
        </div>
      </section>

      <section className="section section--pale">
        <div className="shell">
          <div className="section-title-row">
            <SectionHeading eyebrow="G-LAB PROGRAMS" title="이어지는 교육과 프로젝트" description="운영을 마친 과정과 앞으로 진행할 프로그램을 지역별로 확인하세요." />
            <Link className="text-link text-link--large" href="/courses">전체 교육과정 <span>→</span></Link>
          </div>
          <div className="course-grid course-grid--featured">
            {featuredCourses.length ? featuredCourses.map((course) => <CourseCard key={course.slug} course={course} featured />) : <div className="empty-state"><strong>현재 공개된 예정 과정이 없습니다.</strong><p>새 모집 일정은 알림마당에서 가장 먼저 안내합니다.</p><Link className="button" href="/notices">알림마당 보기 →</Link></div>}
          </div>
        </div>
      </section>

      <section className="section learning-flow-section">
        <div className="shell learning-flow-layout">
          <div className="learning-flow-copy">
            <SectionHeading eyebrow="CONNECTED LEARNING" title="모집부터 성과 환류까지, 하나로 이어집니다." description="G-Lab 플랫폼이 과정 안내·신청·성과를 통합하고, 통합 LMS가 온라인 자료·과제·수료 현황을 연결합니다." />
            <a className="button" href={LMS_URL} target="_blank" rel="noreferrer">통합 LMS 바로가기 <span>↗</span></a>
          </div>
          <ol className="learning-flow">
            <li><span>01</span><div><strong>교육 찾기</strong><p>지역·분야·모집 상태로 검색</p></div></li>
            <li><span>02</span><div><strong>간편 신청</strong><p>온라인 신청과 접수 확인</p></div></li>
            <li><span>03</span><div><strong>온·오프라인 수강</strong><p>LMS 진도·자료·과제 연동</p></div></li>
            <li><span>04</span><div><strong>성과와 다음 배움</strong><p>결과 데이터가 다음 교육 기획으로 환류</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section section--navy schedule-section">
        <div className="shell schedule-layout">
          <div>
            <SectionHeading eyebrow="2026 PROGRAM ROADMAP" title="다가오는 GLab 일정" description="예정된 교육 일정을 모았습니다. 모집 방식과 세부 일정은 알림마당에서 안내합니다." />
            <Link href="/courses" className="button button--outline-light">전체 일정 보기 →</Link>
          </div>
          <div className="schedule-list">
            {courses.filter((course) => course.status !== "closed").slice(0, 4).map((course) => {
              const region = regionMap[course.region as RegionSlug];
              const display = getCourseDisplayInfo(course);
              return (
                <Link href={`/courses/${course.slug}`} key={course.slug}>
                  <time><b>2026</b><strong>{display.scheduleBadge}</strong></time>
                  <div><span style={{ color: region.color }}>{region.koreanName} · {course.category}</span><h3>{course.title}</h3><p>{display.application}</p></div>
                  <b aria-hidden="true">↗</b>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section reviews-preview">
        <div className="shell">
          <div className="section-title-row">
            <SectionHeading eyebrow="FIELD FEEDBACK" title="현장에서 이어진 배움과 과제" description="교육 현장의 참여자 의견과 운영 성과를 다음 과정에 반영합니다." />
            <Link className="text-link text-link--large" href="/reviews">후기 전체보기 <span>→</span></Link>
          </div>
          <div className="review-grid">
            {reviews.slice(0, 3).map((review) => {
              const region = regionMap[review.region as RegionSlug];
              return (
                <article className="review-card" key={review.id}>
                  <div className="review-card__top"><span className={review.rating > 0 ? "review-stars" : "review-source"}>{review.rating > 0 ? "★".repeat(review.rating) : "현장 피드백"}</span><b style={{ color: region.color }}>{region.koreanName}</b></div>
                  <h3>{review.title}</h3><p>{review.rating > 0 ? `“${review.content}”` : review.content}</p>
                  <footer><span className="avatar" aria-hidden="true">{review.author.slice(0, 1)}</span><div><strong>{review.author}</strong><small>{review.role}</small></div></footer>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="news-section section section--pale">
        <div className="shell news-layout">
          <div><span className="eyebrow">GLAB NEWS</span><h2>새로운 교육 소식</h2><p>모집, 개강, 운영 안내를 빠르게 확인하세요.</p><Link href="/notices" className="text-link">공지 전체보기 →</Link></div>
          <div className="notice-list">
            {notices.slice(0, 3).map((notice) => <Link href={`/notices/${notice.id}`} key={notice.id}><span>{notice.category}</span><strong>{notice.title}</strong><time>{notice.createdAt.slice(0, 10).replaceAll("-", ".")}</time><b>→</b></Link>)}
          </div>
        </div>
      </section>
    </>
  );
}
