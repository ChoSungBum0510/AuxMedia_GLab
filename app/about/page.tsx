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
  description: "한림대학교 G-Lab의 지역 협력, 문제해결형 교육과 정선·동해·인제 활동을 홍보영상과 함께 소개합니다.",
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
    description: "과정 안내·모집·출결·아카이브·성과관리를 일원화해 교육과 성과가 흩어지지 않게 합니다.",
  },
];

const journey = [
  { index: "01", title: "지역 수요·현안 발굴", description: "공유 협업 협의체와 현장 대화를 통해 지역의 과제를 구체화합니다." },
  { index: "02", title: "정책연구·산학협력", description: "지자체 정책연구와 기업 기술문제 해결, 맞춤형 지원으로 연결합니다." },
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
            <p>한림대학교 G-Lab은 2025년 RISE 사업을 통해 동해·인제·정선을 중심으로 지역혁신 역량강화 플랫폼과 맞춤형 솔루션을 제공하고 있습니다.</p>
            <div className="hero-actions">
              <Link className="button button--white" href="#promotion-film">홍보영상 보기 <span>↓</span></Link>
              <Link className="button button--glass" href="/regions">지역 GLab 만나기 <span>→</span></Link>
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
            <p>지역의 가치를 발견하고 새로운 가능성을 실현하는 한림대학교의 지역혁신 활동과 정선·동해·인제 G-Lab의 방향을 영상에서 확인해 보세요.</p>
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
            <div><span>OFFICIAL FILM</span><strong>HALLYM UNIVERSITY G-LAB</strong></div>
            <a href={PROMOTION_VIDEO_URL} target="_blank" rel="noreferrer">YouTube에서 보기 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className="section about-purpose-section">
        <div className="shell about-purpose">
          <div>
            <span className="eyebrow">WHY G-LAB</span>
            <h2>단회성 교육에서<br />지속형 교육체계로</h2>
          </div>
          <div className="about-purpose__copy">
            <p>동해 AI 미디어 과정은 8차시·28시간 동안 접수 77명, 참석 64명과 83.1%의 참석률을 기록했고, 정선 청소년 드론교육은 총 7회·42시간 운영과 드론 4종 이수 7명의 성과를 확인했습니다.</p>
            <p>이제 확인된 성과를 학기제·심화과정·통합 플랫폼으로 연결해, 흥미 중심의 체험이 기본기와 프로젝트, 지역에 남는 결과물로 이어지게 합니다.</p>
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
            <h2>현안을 찾고,<br />협력하고,<br />다음 교육으로 잇습니다.</h2>
            <p>정책연구와 산학협력, 교과·비교과 프로그램, 성과관리를 하나의 지역혁신 흐름으로 연결합니다.</p>
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
            description="정선·동해·인제의 공식 특화 방향과 실제 운영 성과, 공개된 예정 프로그램을 확인하세요."
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

      <section className="about-evidence">
        <div className="shell">
          <span>CONTENT BASIS</span>
          <p>사이트의 운영 수치와 프로그램 내용은 「2026 한림 G-Lab@동해 지역 연계 협업 지·산·학 간담회」 배포자료, 2025 정선 드론 사업 결과, 2026 동해 AI 미디어 4~7월 결과자료를 기준으로 정리했습니다.</p>
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
