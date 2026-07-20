import Link from "next/link";
import { CourseCard } from "../components/CourseCard";
import { RegionMap } from "../components/RegionMap";
import { SectionHeading } from "../components/SectionHeading";
import { BrandLogo } from "../components/BrandLogo";
import { RegionBadge } from "../components/RegionBadge";
import { fallbackCourseRecords, fallbackNotices, fallbackReviews, LMS_URL, regionMap, regions, type RegionSlug } from "../lib/content";
import { listCourses, listPublishedNotices, listPublishedReviews } from "../db/repository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [courses, reviews, notices] = await Promise.all([
    listCourses().catch(() => fallbackCourseRecords),
    listPublishedReviews().catch(() => fallbackReviews),
    listPublishedNotices().catch(() => fallbackNotices),
  ]);
  const featuredCourses = courses.filter((course) => course.status === "open").slice(0, 3);

  return (
    <>
      <section className="home-hero">
        <div className="home-hero__image" aria-hidden="true" />
        <div className="home-hero__shade" aria-hidden="true" />
        <div className="home-hero__content shell">
          <span className="hero-kicker">HALLYM REGIONAL LEARNING NETWORK</span>
          <h1>지역이 변하는 순간,<br /><span className="home-hero__brand-line"><BrandLogo className="official-brand--hero" dark /><span>이 함께합니다.</span></span></h1>
          <p>정선·동해·인제에서 열리는 교육과정과 신청, 온라인 학습, 수강후기를 이제 한곳에서 만나보세요.</p>
          <div className="hero-actions">
            <Link className="button button--white" href="#regional-map">지역 교육 찾기 <span>↓</span></Link>
            <Link className="button button--glass" href="/courses">모집 중 교육 보기 <span>→</span></Link>
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
          <div><span className="eyebrow">ONE GLAB PLATFORM</span><h2>흩어진 지역교육 정보를<br />하나의 흐름으로.</h2></div>
          <p>찾는 사람은 더 쉽게 신청하고, 배우는 사람은 끊김 없이 수강하며, 운영자는 지역별 현황을 한 번에 관리합니다.</p>
          <div className="intro-metrics">
            <div><strong>3</strong><span>지역 GLab</span></div>
            <div><strong>19</strong><span>연간 교육과정</span></div>
            <div><strong>496</strong><span>누적 학습자</span></div>
          </div>
        </div>
      </section>

      <section className="map-section section" id="regional-map">
        <div className="shell">
          <SectionHeading eyebrow="GLAB ACROSS GANGWON" title="지도로 만나는 지역 GLab" description="현재 GLab이 교육을 운영하는 세 지역입니다. 원하는 지역을 선택해 교육과정과 활동을 확인하세요." />
          <RegionMap />
        </div>
      </section>

      <section className="section section--pale">
        <div className="shell">
          <div className="section-title-row">
            <SectionHeading eyebrow="OPEN PROGRAMS" title="지금 신청할 수 있는 교육" description="지역별 모집 중인 과정을 비교하고 바로 신청하세요." />
            <Link className="text-link text-link--large" href="/courses">전체 교육과정 <span>→</span></Link>
          </div>
          <div className="course-grid course-grid--featured">
            {featuredCourses.map((course) => <CourseCard key={course.slug} course={course} featured />)}
          </div>
        </div>
      </section>

      <section className="section learning-flow-section">
        <div className="shell learning-flow-layout">
          <div className="learning-flow-copy">
            <SectionHeading eyebrow="CONNECTED LEARNING" title="신청부터 수료까지, 하나로 이어집니다." description="정보를 찾은 뒤 다른 사이트를 헤맬 필요 없이 GLab 플랫폼과 통합 LMS가 학습 전 과정을 연결합니다." />
            <a className="button" href={LMS_URL} target="_blank" rel="noreferrer">통합 LMS 바로가기 <span>↗</span></a>
          </div>
          <ol className="learning-flow">
            <li><span>01</span><div><strong>교육 찾기</strong><p>지역·분야·모집 상태로 검색</p></div></li>
            <li><span>02</span><div><strong>간편 신청</strong><p>온라인 신청과 접수 확인</p></div></li>
            <li><span>03</span><div><strong>온·오프라인 수강</strong><p>LMS 진도·자료·과제 연동</p></div></li>
            <li><span>04</span><div><strong>후기와 다음 배움</strong><p>경험 공유와 과정 추천</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section section--navy schedule-section">
        <div className="shell schedule-layout">
          <div>
            <SectionHeading eyebrow="JULY — AUGUST 2026" title="다가오는 GLab 일정" description="지역별 모집과 개강 일정을 놓치지 마세요." />
            <Link href="/courses" className="button button--outline-light">전체 일정 보기 →</Link>
          </div>
          <div className="schedule-list">
            {courses.filter((course) => course.status !== "closed").slice(0, 4).map((course) => {
              const region = regionMap[course.region as RegionSlug];
              return (
                <Link href={`/courses/${course.slug}`} key={course.slug}>
                  <time><b>{course.applicationEnd.slice(5, 7)}</b><strong>{course.applicationEnd.slice(8, 10)}</strong></time>
                  <div><span style={{ color: region.color }}>{region.koreanName} · {course.category}</span><h3>{course.title}</h3><p>신청 마감</p></div>
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
            <SectionHeading eyebrow="LEARNER STORIES" title="배움이 만든 지역의 변화" description="GLab에서 먼저 경험한 학습자들의 이야기입니다." />
            <Link className="text-link text-link--large" href="/reviews">후기 전체보기 <span>→</span></Link>
          </div>
          <div className="review-grid">
            {reviews.slice(0, 3).map((review) => {
              const region = regionMap[review.region as RegionSlug];
              return (
                <article className="review-card" key={review.id}>
                  <div className="review-card__top"><span className="review-stars">{"★".repeat(review.rating)}</span><b style={{ color: region.color }}>{region.koreanName}</b></div>
                  <h3>{review.title}</h3><p>“{review.content}”</p>
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
