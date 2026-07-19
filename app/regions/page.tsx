import type { Metadata } from "next";
import Link from "next/link";
import { RegionBadge } from "../../components/RegionBadge";
import { SectionHeading } from "../../components/SectionHeading";
import { RegionMap } from "../../components/RegionMap";
import { regions } from "../../lib/content";

export const metadata: Metadata = { title: "지역 GLab", description: "정선·동해·인제 GLab의 교육 활동과 과정을 확인하세요." };

export default function RegionsPage() {
  return (
    <>
      <section className="page-hero page-hero--regions">
        <div className="shell"><span className="eyebrow eyebrow--light">REGIONAL GLAB NETWORK</span><h1>지역마다 다른 가능성,<br />하나로 연결된 배움.</h1><p>정선·동해·인제의 삶과 산업, 자연을 반영한 GLab 교육을 만나보세요.</p></div>
      </section>
      <section className="section"><div className="shell"><SectionHeading eyebrow="SELECT A REGION" title="세 지역, 세 가지 배움의 방식" description="지도 또는 지역 카드를 선택해 상세 교육과정을 확인할 수 있습니다." /><RegionMap /></div></section>
      <section className="section section--pale"><div className="shell region-directory">
        {regions.map((region, index) => (
          <article key={region.slug} style={{ "--region-color": region.color, "--region-pale": region.paleColor } as React.CSSProperties}>
            <div className="region-directory__index">0{index + 1}</div><RegionBadge region={region} />
            <h2>{region.headline}</h2><p>{region.description}</p>
            <ul>{region.focus.map((focus) => <li key={focus}>{focus}</li>)}</ul>
            <Link className="text-link" href={`/regions/${region.slug}`}>{region.koreanName} GLab 자세히 보기 <span>→</span></Link>
          </article>
        ))}
      </div></section>
    </>
  );
}
