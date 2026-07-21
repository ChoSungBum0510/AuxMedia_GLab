import type { Metadata } from "next";
import Link from "next/link";
import { RegionBadge } from "../../components/RegionBadge";
import { SectionHeading } from "../../components/SectionHeading";
import { RegionMap } from "../../components/RegionMap";
import { regions } from "../../lib/content";

export const metadata: Metadata = { title: "지역 GLab", description: "정선·동해·인제 G-Lab의 특화 방향과 교육 성과를 확인하세요." };

export default function RegionsPage() {
  return (
    <>
      <section className="page-hero page-hero--regions">
        <div className="shell"><span className="eyebrow eyebrow--light">REGIONAL G-LAB NETWORK</span><h1>지역의 현안과 대학의 역량을<br />하나의 혁신으로.</h1><p>정선·동해·인제에서 정책 연구, 산학 협력, 교과·비교과 교육을 연결하는 G-Lab 활동을 만나보세요.</p></div>
      </section>
      <section className="section"><div className="shell"><SectionHeading eyebrow="SELECT A REGION" title="세 지역에서 시작되는 맞춤형 혁신" description="지도 또는 지역 카드를 선택해 특화 방향, 교육 성과와 공개된 프로그램을 확인하세요." /><RegionMap /></div></section>
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
