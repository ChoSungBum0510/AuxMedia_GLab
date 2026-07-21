import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCard } from "../../../components/CourseCard";
import { RegionBadge } from "../../../components/RegionBadge";
import { SectionHeading } from "../../../components/SectionHeading";
import { listCourses } from "../../../db/repository";
import { fallbackCourseRecords, regionMap, regions, type RegionSlug } from "../../../lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region: slug } = await params;
  const region = regionMap[slug as RegionSlug];
  return region ? { title: `${region.koreanName} GLab`, description: region.description } : { title: "지역 GLab" };
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: slug } = await params;
  const region = regionMap[slug as RegionSlug];
  if (!region) notFound();
  const courses = await listCourses({ region: slug }).catch(() => fallbackCourseRecords.filter((course) => course.region === slug));

  return (
    <>
      <section className="region-hero" style={{ "--region-color": region.color } as React.CSSProperties}>
        <div className="region-hero__image" style={{ backgroundImage: `url(${region.image})`, backgroundPosition: region.imagePosition }} aria-hidden="true" />
        <div className="region-hero__overlay" aria-hidden="true" />
        <div className="shell region-hero__content"><RegionBadge region={region} dark /><span className="hero-kicker">{region.eyebrow}</span><h1>{region.headline}</h1><p>{region.description}</p><div className="hero-actions"><Link href="#programs" className="button button--white">교육과정 보기 ↓</Link><Link href={`/courses?region=${region.slug}`} className="button button--glass">전체 과정 →</Link></div></div>
      </section>
      <section className="region-overview"><div className="shell region-overview__inner">
        <div><span className="eyebrow">UNIVERSITY × COMMUNITY</span><h2>지역 현안을 발견하고,<br />교육과 협업으로 연결합니다.</h2><p>G-Lab은 지자체 정책 연구, 지역 기업 협업, 교과·비교과 교육을 연결해 지역의 필요가 실제 프로젝트와 지속형 배움으로 이어지게 합니다.</p></div>
        <div className="region-stats">{region.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
        <dl><div><dt>주요 연계 공간</dt><dd>{region.address}</dd></div><div><dt>운영 안내</dt><dd>{region.contact}</dd></div><div><dt>집중 분야</dt><dd>{region.focus.join(" · ")}</dd></div></dl>
      </div></section>
      <section className="section" id="programs"><div className="shell"><div className="section-title-row"><SectionHeading eyebrow={`${region.koreanName.toUpperCase()} PROGRAMS`} title={`${region.koreanName} GLab 교육·활동`} description="운영을 마친 과정과 예정 프로그램을 안내합니다." /><Link href="/courses" className="text-link text-link--large">전체 지역 과정 →</Link></div>{courses.length ? <div className="course-grid">{courses.map((course) => <CourseCard key={course.slug} course={course} />)}</div> : <div className="empty-state"><strong>공개된 교육 일정이 아직 없습니다.</strong><p>{region.koreanName} GLab의 세부 사업과 모집 일정은 확정 후 알림마당에서 안내합니다.</p><Link className="button" href="/notices">알림마당 확인하기 →</Link></div>}</div></section>
      <section className="section section--pale"><div className="shell region-focus-layout">
        <div><SectionHeading eyebrow="WHAT WE FOCUS ON" title="지역 수요에서 시작하는 특화 분야" description={`${region.koreanName}의 현안과 한림대학교의 특성화 역량을 연구·교육·협력 프로젝트로 연결합니다.`} /><div className="focus-tags">{region.focus.map((focus, index) => <span key={focus}><b>0{index + 1}</b>{focus}</span>)}</div></div>
        <div className="region-photo-card" style={{ backgroundImage: `url(${region.image})`, backgroundPosition: region.imagePosition }}><div><span>{region.koreanName} G-Lab</span><strong>지역의 필요를<br />지속형 변화로</strong></div></div>
      </div></section>
      <section className="section"><div className="shell next-regions"><div><span className="eyebrow">EXPLORE MORE</span><h2>다른 지역의 GLab도 살펴보세요.</h2></div>{regions.filter((item) => item.slug !== region.slug).map((item) => <Link key={item.slug} href={`/regions/${item.slug}`} style={{ "--region-color": item.color } as React.CSSProperties}><RegionBadge region={item} compact /><span>{item.headline}</span><b>↗</b></Link>)}</div></section>
    </>
  );
}
