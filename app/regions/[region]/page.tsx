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
        <div><span className="eyebrow">UNIVERSITY × COMMUNITY</span><h2>대학과 지역이 함께 묻고,<br />배우고, 실행합니다.</h2><p>일방적인 교육을 넘어 지역 구성원과 현안을 정의하고, 배움과 실증을 통해 지속 가능한 변화로 연결합니다.</p></div>
        <div className="region-stats">{region.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
        <dl><div><dt>교육 거점</dt><dd>{region.address}</dd></div><div><dt>운영 문의</dt><dd>{region.contact}</dd></div><div><dt>집중 분야</dt><dd>{region.focus.join(" · ")}</dd></div></dl>
      </div></section>
      <section className="section" id="programs"><div className="shell"><div className="section-title-row"><SectionHeading eyebrow={`${region.koreanName.toUpperCase()} PROGRAMS`} title={`${region.koreanName} GLab 교육과정`} description="현재 모집 중이거나 곧 시작하는 과정을 확인하세요." /><Link href="/courses" className="text-link text-link--large">전체 지역 과정 →</Link></div><div className="course-grid">{courses.map((course) => <CourseCard key={course.slug} course={course} />)}</div></div></section>
      <section className="section section--pale"><div className="shell region-focus-layout">
        <div><SectionHeading eyebrow="WHAT WE FOCUS ON" title="현안을 해결하는 실천형 배움" description={`${region.koreanName}의 수요를 교육·연구·리빙랩 프로젝트로 연결합니다.`} /><div className="focus-tags">{region.focus.map((focus, index) => <span key={focus}><b>0{index + 1}</b>{focus}</span>)}</div></div>
        <div className="region-photo-card" style={{ backgroundImage: `url(${region.image})`, backgroundPosition: region.imagePosition }}><div><span>{region.koreanName} G-Lab</span><strong>함께 발견하고<br />함께 해결하는 교육</strong></div></div>
      </div></section>
      <section className="section"><div className="shell next-regions"><div><span className="eyebrow">EXPLORE MORE</span><h2>다른 지역의 GLab도 살펴보세요.</h2></div>{regions.filter((item) => item.slug !== region.slug).map((item) => <Link key={item.slug} href={`/regions/${item.slug}`} style={{ "--region-color": item.color } as React.CSSProperties}><RegionBadge region={item} compact /><span>{item.headline}</span><b>↗</b></Link>)}</div></section>
    </>
  );
}
