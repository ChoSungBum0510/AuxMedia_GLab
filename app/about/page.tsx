import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { RegionBadge } from "../../components/RegionBadge";
import { SectionHeading } from "../../components/SectionHeading";
import { regions } from "../../lib/content";

const PROMOTION_VIDEO_URL = "https://youtu.be/zRnJ9bulKv0";
const PROMOTION_VIDEO_EMBED_URL = "https://www.youtube-nocookie.com/embed/zRnJ9bulKv0?rel=0&modestbranding=1";

export const metadata: Metadata = {
  title: "GLab 소개",
  description: "한림대학교 G-Lab의 지역 협력, 문제 해결형 교육과 정선·동해·인제 G-Lab, 강릉 M Campus 활동을 홍보 영상과 함께 소개합니다.",
};

const values = [
  {
    index: "01",
    title: "학기제 교육",
    description: "단회성 특강은 입문 채널로 유지하고 심화과정이 연속되는 구조로 역량을 축적합니다.",
  },
  {
    index: "02",
    title: "기본·심화과정 병행",
    description: "기초 정규과정과 콘텐츠형 교육을 함께 운영하고 수료자가 프로젝트 단계로 이동하게 합니다.",
  },
  {
    index: "03",
    title: "통합 연계 교육 플랫폼",
    description: "과정 안내·모집·출결·아카이브·성과 관리를 일원화해 교육과 성과가 흩어지지 않게 합니다.",
  },
];

const projectPillars = [
  {
    index: "01",
    title: "미디어 프로덕션",
    items: ["브랜딩·내러티브·바이럴 콘텐츠 제작", "디지털 이미지·영상 처리: DI·VFX"],
  },
  {
    index: "02",
    title: "드론 랩",
    items: ["드론 도입·현장 적용 컨설팅과 실습", "드론 실무·교육 프로그램 운영"],
  },
  {
    index: "03",
    title: "프로젝트 솔루션",
    items: ["미디어·드론 프로젝트 지원과 운영", "교육·멘토링·연구 개발 연계 솔루션"],
  },
];

const programTypes = [
  ["콘텐츠 교육", "항공촬영·콘텐츠 제작, 시각 자료·광고·숏폼"],
  ["기업 맞춤형 교육", "AI·미디어와 중소기업·스타트업 미디어 실무"],
  ["정규과정", "영상 미디어 DI·VFX·SFX와 관광·홍보 콘텐츠 제작"],
  ["심화·연계 과정", "지·산·학 과정과 교육 사업·지역 연계 프로젝트"],
];

const journey = [
  { index: "01", title: "지역 수요·현안 발굴", description: "공유 협업 협의체와 현장 대화를 통해 지역의 과제를 구체화합니다." },
  { index: "02", title: "정책 연구·산학 협력", description: "지자체 정책 연구와 기업 기술 문제 해결, 맞춤형 지원으로 연결합니다." },
  { index: "03", title: "교과·비교과 교육", description: "지역 문제를 주제로 한 학습과 프로젝트로 청년 인재의 유입·정착을 돕습니다." },
  { index: "04", title: "성과 데이터 환류", description: "참여·수료·결과물 데이터를 다음 교육 기획과 지역 확산에 반영합니다." },
];

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="about-hero__image" aria-hidden="true" />
        <div className="about-hero__shade" aria-hidden="true" />
        <div className="shell about-hero__inner">
          <div>
            <span className="eyebrow eyebrow--light">REGIONAL CRISIS RESPONSE · G-LAB</span>
            <h1>지역 위기를 기회로 전환하는<br />지역혁신 플랫폼.</h1>
            <p>한림대학교는 정선·동해·인제 G-Lab과 강릉 M Campus를 통해 지역의 수요와 대학의 역량을 연결하는 교육·협력 기반을 넓혀가고 있습니다.</p>
            <div className="hero-actions">
              <Link className="button button--white" href="#promotion-film">홍보 영상 보기 <span>↓</span></Link>
              <Link className="button button--glass" href="/regions">지역 교육 거점 만나기 <span>→</span></Link>
            </div>
          </div>
          <div className="about-hero__brand-mark">
            <span>HALLYM REGIONAL INNOVATION</span>
            <Image
              src="/brand/hallym-glab.png"
              alt="한림 G Lab"
              width={627}
              height={149}
              priority
            />
            <p>대학과 지역이 함께 만드는 미래</p>
          </div>
        </div>
      </section>

      <section className="about-video-section" id="promotion-film">
        <div className="shell">
          <div className="about-video-heading">
            <div>
              <span className="eyebrow">GLAB PROMOTION FILM</span>
              <h2>지역과 세계를 잇는<br />혁신의 거점</h2>
            </div>
            <p>지역의 가치를 발견하고 새로운 가능성을 실현하는 한림대학교의 지역혁신 활동과 지역 교육 거점의 방향을 영상에서 확인해 보세요.</p>
          </div>
          <div className="about-video-frame">
            <iframe
              src={PROMOTION_VIDEO_EMBED_URL}
              title="2025 한림대학교 G-Lab 홍보 영상"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="about-video-meta">
            <div><span>PROMOTION FILM</span><strong>HALLYM UNIVERSITY G-LAB</strong></div>
            <a href={PROMOTION_VIDEO_URL} target="_blank" rel="noreferrer">YouTube에서 보기 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className="section about-purpose-section">
        <div className="shell about-purpose">
          <div>
            <span className="eyebrow">WHY G-LAB</span>
            <h2>지속형 교육체계로<br />전환을 위한 첫 시작</h2>
          </div>
          <div className="about-purpose__copy">
            <p>동해 AI 미디어 과정은 8차시·28시간 동안 접수 77명, 참석 64명과 83.1%의 참석률을 기록했고, 정선 청소년 드론교육은 총 7회·42시간 운영과 드론 4종 이수 7명의 성과를 확인했습니다.</p>
            <p>이 성과를 학기제·심화과정·통합 플랫폼으로 연결해, 흥미 중심의 체험이 기본기와 프로젝트, 지역에 남는 결과물로 이어지게 합니다.</p>
          </div>
        </div>
        <div className="shell about-value-grid">
          {values.map((value) => (
            <article key={value.index}>
              <span>{value.index}</span>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--pale about-project-section" id="project-education">
        <div className="shell">
          <div className="about-project-heading">
            <div>
              <span className="eyebrow">MEDIA · DRONE TECH</span>
              <h2>미디어·드론 테크 기반<br />프로젝트 교육</h2>
            </div>
            <p>미디어와 드론 기술을 접목한 실무 중심 프로젝트 교육으로 지역 현장 과제를 발굴하고, 교육과 결과물 제작까지 연결합니다.</p>
          </div>
          <div className="about-project-grid">
            {projectPillars.map((pillar) => (
              <article key={pillar.index}>
                <span>{pillar.index}</span>
                <h3>{pillar.title}</h3>
                <ul>{pillar.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="about-program-types">
            {programTypes.map(([title, description], index) => (
              <div key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{title}</strong>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--navy about-journey-section">
        <div className="shell about-journey-layout">
          <div>
            <span className="eyebrow eyebrow--light">HOW WE WORK</span>
            <h2>현안을 찾고,<br />협력하고,<br />다음 교육으로 잇습니다.</h2>
            <p>정책 연구와 산학 협력, 교과·비교과 프로그램, 성과 관리를 하나의 지역 혁신 흐름으로 연결합니다.</p>
          </div>
          <ol className="about-journey">
            {journey.map((step) => (
              <li key={step.index}>
                <span>{step.index}</span>
                <div><strong>{step.title}</strong><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--pale">
        <div className="shell">
          <SectionHeading
            eyebrow="FOUR REGIONAL HUBS"
            title="네 지역에서 이어지는 교육과 협력"
            description="정선·동해·인제 G-Lab과 강릉 M Campus의 특화 방향, 교육 정보와 공개된 예정 프로그램을 확인하세요."
          />
          <div className="about-region-grid">
            {regions.map((region) => (
              <Link
                key={region.slug}
                href={`/regions/${region.slug}`}
                style={{ "--region-color": region.color, "--region-pale": region.paleColor } as CSSProperties}
              >
                <RegionBadge region={region} />
                <p>{region.description}</p>
                <strong>{region.displayName} 자세히 보기 <span>→</span></strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="about-final-cta">
        <div className="shell">
          <span className="eyebrow eyebrow--light">START YOUR LEARNING</span>
          <h2>지역이 변하는 순간에<br />함께해 보세요.</h2>
          <p>관심 지역과 교육과정을 찾고, G-Lab의 다음 배움에 참여할 수 있습니다.</p>
          <div>
            <Link className="button button--white" href="/courses">교육과정 찾아보기 <span>→</span></Link>
            <Link className="button button--outline-light" href="/notices">새로운 소식 보기 <span>→</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
