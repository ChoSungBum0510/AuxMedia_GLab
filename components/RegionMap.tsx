import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { regionMap, regions, type RegionSlug } from "../lib/content";
import { RegionBadge } from "./RegionBadge";

type RegionGeometry = {
  top: string;
  left: string;
  clipPath: string;
};

// Extracted from the supplied Gangwon administrative map. The map pin anchors
// sit inside each real district, while the polygons follow its visible border.
const geometry: Record<RegionSlug, RegionGeometry> = {
  inje: {
    top: "35.24%",
    left: "53.89%",
    clipPath: "polygon(50.88% 13.07%,47.50% 14.89%,49.93% 18.70%,49.78% 21.99%,48.24% 25.28%,48.24% 27.62%,46.84% 30.22%,47.65% 32.47%,46.99% 34.29%,47.80% 35.58%,47.94% 39.91%,47.28% 40.78%,45.67% 40.69%,44.86% 41.30%,44.79% 42.34%,44.05% 43.46%,44.05% 44.33%,46.18% 46.84%,49.05% 47.36%,49.34% 47.88%,49.34% 49.44%,51.10% 51.00%,51.69% 51.17%,53.96% 48.40%,54.77% 48.57%,56.02% 50.04%,57.27% 50.04%,58.30% 48.31%,60.35% 47.45%,61.45% 47.71%,62.85% 46.67%,62.26% 45.45%,62.19% 42.08%,62.56% 41.65%,63.95% 41.39%,64.17% 39.91%,63.22% 37.66%,60.35% 37.58%,59.99% 37.23%,59.91% 35.06%,59.10% 33.77%,59.18% 32.81%,59.54% 32.29%,61.75% 32.55%,62.19% 32.29%,60.57% 29.18%,60.94% 27.88%,60.79% 24.85%,60.13% 24.68%,58.44% 25.28%,56.24% 23.46%,54.33% 18.61%,52.50% 17.40%)",
  },
  donghae: {
    top: "69.18%",
    left: "89.06%",
    clipPath: "polygon(92.00% 67.62%,91.34% 66.84%,88.84% 65.37%,86.27% 67.79%,83.92% 67.88%,83.48% 69.52%,83.92% 71.34%,83.55% 72.99%,83.70% 73.68%,84.80% 74.11%,87.22% 72.12%,89.06% 72.55%,89.94% 72.38%,92.44% 70.22%)",
  },
  jeongseon: {
    top: "77.06%",
    left: "72.69%",
    clipPath: "polygon(80.32% 63.81%,79.66% 64.07%,78.78% 65.71%,79.15% 69.00%,78.78% 69.61%,77.17% 69.70%,76.36% 68.31%,73.94% 67.88%,72.91% 68.48%,71.29% 67.45%,69.82% 68.57%,68.94% 66.67%,68.28% 67.27%,68.28% 68.74%,67.62% 69.70%,67.77% 71.77%,67.40% 71.95%,66.67% 71.34%,66.59% 72.99%,66.30% 73.51%,64.98% 72.90%,64.24% 73.94%,64.46% 74.89%,64.02% 76.36%,64.68% 77.23%,65.57% 77.14%,66.37% 78.79%,66.23% 79.74%,67.33% 83.38%,68.06% 84.07%,66.89% 85.89%,67.03% 87.71%,68.06% 88.48%,69.38% 88.23%,69.60% 89.18%,70.41% 90.04%,72.69% 90.04%,74.01% 87.97%,75.77% 87.97%,77.90% 91.00%,79.59% 90.48%,80.76% 91.08%,80.84% 92.29%,81.35% 91.69%,81.28% 87.97%,79.07% 83.29%,79.52% 81.04%,78.93% 80.17%,78.93% 79.22%,79.37% 77.40%,80.10% 76.71%,80.25% 74.89%,82.16% 73.07%,83.41% 73.42%,83.70% 71.34%,83.26% 69.52%,83.70% 67.97%,82.89% 67.88%,82.31% 66.67%,81.13% 66.84%,80.76% 66.58%)",
  },
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
            width={1362}
            height={1155}
            unoptimized
            sizes="(max-width: 1100px) 100vw, 760px"
          />
          {regions.map((region) => {
            const shapeStyle = {
              clipPath: geometry[region.slug].clipPath,
              "--region-color": region.color,
            } as CSSProperties;
            const pinStyle = {
              top: geometry[region.slug].top,
              left: geometry[region.slug].left,
              "--region-color": region.color,
            } as CSSProperties;
            return (
              <div className={`map-region-group map-region-group--${region.slug}`} key={region.slug}>
                <Link
                  href={`/regions/${region.slug}`}
                  className={`map-region-shape map-region-shape--${region.slug}`}
                  style={shapeStyle}
                  aria-label={`${region.koreanName} 행정구역에서 운영 중인 GLab 교육 보기`}
                >
                  <span className="sr-only">{region.koreanName} GLab 교육 상세 보기</span>
                </Link>
                <Link
                  href={`/regions/${region.slug}`}
                  className={`map-pin map-pin--${region.slug}`}
                  style={pinStyle}
                  aria-label={`${region.koreanName} GLab 교육 상세 보기`}
                >
                  <RegionBadge region={region} compact />
                  <small>{region.koreanName} 교육과정 보기 →</small>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <div className="map-region-list">
        <span className="eyebrow">3 REGIONAL LABS</span>
        <h3>지역을 선택하면<br />교육이 보입니다.</h3>
        <p>지도에서 행정구역이나 지역 로고를 누르면 모집 과정, 일정, 교육 장소와 수강후기를 한 번에 확인할 수 있습니다.</p>
        <div className="map-region-list__items">
          {regions.map((region) => (
            <Link key={region.slug} href={`/regions/${region.slug}`}>
              <RegionBadge region={regionMap[region.slug]} compact dark />
              <span>{region.headline}</span>
              <b aria-hidden="true">↗</b>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
