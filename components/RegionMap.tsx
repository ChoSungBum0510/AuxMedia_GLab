import Image from "next/image";
import Link from "next/link";
import { regionMap, regions } from "../lib/content";
import { RegionBadge } from "./RegionBadge";

const positions = {
  inje: { top: "31%", left: "61%" },
  donghae: { top: "67%", left: "83%" },
  jeongseon: { top: "75%", left: "66%" },
};

export function RegionMap() {
  return (
    <div className="region-map-layout">
      <div className="map-stage" aria-label="GLab 교육 지역 지도">
        <div className="map-canvas">
          <Image
            className="map-base"
            src="/brand/gangwon-map-clean.png"
            alt="강원특별자치도 행정구역 지도"
            width={1365}
            height={1152}
            unoptimized
            sizes="(max-width: 1100px) 100vw, 760px"
          />
          {regions.map((region) => {
            const pinStyle: React.CSSProperties & { "--region-color": string } = {
              ...positions[region.slug],
              "--region-color": region.color,
            };
            return (
              <Link
                key={region.slug}
                href={`/regions/${region.slug}`}
                className={`map-pin map-pin--${region.slug}`}
                style={pinStyle}
                aria-label={`${region.koreanName} GLab 교육 상세 보기`}
              >
                <span className="map-pin__pulse" aria-hidden="true" />
                <span className="map-pin__dot" aria-hidden="true" />
                <RegionBadge region={region} compact />
                <small>교육 보기 →</small>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="map-region-list">
        <span className="eyebrow">3 REGIONAL LABS</span>
        <h3>지역을 선택하면<br />교육이 보입니다.</h3>
        <p>지도에서 지역을 누르면 모집 과정, 일정, 교육 장소와 수강후기를 한 번에 확인할 수 있습니다.</p>
        <div className="map-region-list__items">
          {regions.map((region) => (
            <Link key={region.slug} href={`/regions/${region.slug}`}>
              <RegionBadge region={regionMap[region.slug]} compact />
              <span>{region.headline}</span>
              <b aria-hidden="true">↗</b>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
