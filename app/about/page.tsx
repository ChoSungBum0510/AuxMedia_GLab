import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { RegionBadge } from "../../components/RegionBadge";
import { SectionHeading } from "../../components/SectionHeading";
import { regions } from "../../lib/content";

const PROMOTION_VIDEO_URL = "https://youtu.be/zRnJ9bulKv0";
const PROMOTION_VIDEO_EMBED_URL = "https://www.youtube-nocookie.com/embed/zRnJ9bulKv0?rel=0&modestbranding=1";

export const metadata: Metadata = {
  title: "GLab 소개",
  description: "한림대학교 G-Lab의 지역 협력, 문제해결형 교육과 정선·동해·인제 활동을 홍보영상과 함께 소개합니다.",
};

const values = [
  {
    index: "01",
    title: "지역의 질문에서 시작합니다",
    description: "지역 구성원이 마주한 필요와 가능성을 함께 발견하고, 교육의 출발점으로 삼습니다.",
  },
  {
    index: "02",
    title: "대학의 역량을 연결합니다",
    description: "한림대학교의 전문성과 지역의 경험을 교육·연구·리빙랩으로 촘촘하게 연결합니다.",
  },
  {
    index: "03",
    title: "배움을 실행으로 만듭니다",
    description: "배운 내용을 프로젝트와 실증으로 이어가며 지역에 남는 변화와 다음 기회를 만듭니다.",
  },
];

const journey = [
  { index: "01", title: "함께 발견하기", description: "지역 현장과 대화하며 해결할 질문을 구체화합니다." },
  { index: "02", title: "함께 배우기", description: "필요한 지식과 도구를 익히고 서로의 경험을 나눕니다." },
  { index: "03", title: "함께 실험하기", description: "프로젝트와 리빙랩을 통해 아이디어를 실제로 검증합니다." },
  { index: "04", title: "지역에 이어가기", description: "성과와 경험을 공유하고 다음 교육과 활동으로 확장합니다." },
];

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="about-hero__image" aria-hidden="true" />
        <div className="about-hero__shade" aria-hidden="true" />
        <div className="shell about-hero__inner">
          <div>
            <span className="eyebrow eyebrow--light">ABOUT HALLYM G-LAB</span>
            <h1>지역의 질문이 배움이 되고,<br />배움이 변화로 이어집니다.</h1>
            <p>한림대학교 G-Lab은 대학의 전문성과 지역의 경험을 연결해 정선·동해·인제에서 함께 배우고, 실험하고, 실행하는 지역협력 교육 플랫폼입니다.</p>
            <div className="hero-actions">
              <Link className="button button--white" href="#promotion-film">홍보영상 보기 <span>↓</span></Link>
              <Link className="button button--glass" href="/regions">지역 GLab 만나기 <span>→</span></Link>
            </div>
          </div>
          <div className="about-hero__signal" aria-hidden="true">
            <span>UNIVERSITY</span>
            <b>×</b>
            <span>COMMUNITY</span>
            <strong>G-LAB</strong>
          </div>
        </div>
      </section>

      <section className="about-video-section" id="promotion-film">
        <div className="shell">
          <div className="about-video-heading">
            <div>
              <span className="eyebrow">GLAB PROMOTION FILM</span>
              <h2>영상으로 만나는<br />한림대학교 G-Lab</h2>
            </div>
            <p>지역과 대학이 어떤 방식으로 만나 배움의 기회를 만들고, 그 경험을 다시 지역의 변화로 연결하는지 홍보영상에서 확인해 보세요.</p>
          </div>
          <div className="about-video-frame">
            <iframe
              src={PROMOTION_VIDEO_EMBED_URL}
              title="2025 한림대학교 G-Lab 홍보영상"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="about-video-meta">
            <div><span>2025</span><strong>HALLYM UNIVERSITY G-LAB</strong></div>
            <a href={PROMOTION_VIDEO_URL} target="_blank" rel="noreferrer">YouTube에서 보기 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className="section about-purpose-section">
        <div className="shell about-purpose">
          <div>
            <span className="eyebrow">WHY G-LAB</span>
            <h2>지역과 대학이 함께 만드는<br />실행형 배움</h2>
          </div>
          <div className="about-purpose__copy">
            <p>G-Lab의 교육은 정해진 답을 전달하는 데서 끝나지 않습니다. 지역의 구성원과 대학이 같은 질문 앞에 서서 필요한 지식과 도구를 배우고, 작은 실험을 통해 실제로 작동하는 해결안을 만들어갑니다.</p>
            <p>교육과 연구, 프로젝트와 리빙랩을 하나의 흐름으로 연결해 참여자의 성장을 지역의 지속 가능한 변화로 이어가는 것이 G-Lab의 목표입니다.</p>
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

      <section className="section section--navy about-journey-section">
        <div className="shell about-journey-layout">
          <div>
            <span className="eyebrow eyebrow--light">HOW WE WORK</span>
            <h2>함께 발견하고,<br />함께 배우고,<br />함께 이어갑니다.</h2>
            <p>지역의 질문을 찾는 순간부터 결과를 다시 지역에 나누는 순간까지, 모든 과정은 참여와 협력으로 완성됩니다.</p>
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
            eyebrow="THREE REGIONAL LABS"
            title="세 지역에서 이어지는 G-Lab"
            description="정선·동해·인제의 지역별 교육과 활동을 살펴보고 지금 참여할 수 있는 과정을 확인하세요."
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
                <strong>{region.koreanName} GLab 자세히 보기 <span>→</span></strong>
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
