import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { regionMap, regions, type RegionSlug } from "../lib/content";
import { RegionBadge } from "./RegionBadge";

type RegionGeometry = {
  top: string;
  left: string;
  shapeTop: string;
  shapeLeft: string;
  shapeWidth: string;
  shapeHeight: string;
  clipPath: string;
};

// Extracted from the supplied Gangwon administrative map. The map pin anchors
// sit inside each real district, while the polygons follow its visible border.
const geometry: Record<RegionSlug, RegionGeometry> = {
  inje: {
    top: "35.24%",
    left: "53.89%",
    shapeTop: "13.07%",
    shapeLeft: "44.05%",
    shapeWidth: "20.12%",
    shapeHeight: "38.10%",
    clipPath: "polygon(33.95% 0.00%,17.15% 4.78%,29.22% 14.78%,28.48% 23.41%,20.83% 32.05%,20.83% 38.19%,13.87% 45.01%,17.89% 50.92%,14.61% 55.70%,18.64% 59.08%,19.33% 70.45%,16.05% 72.73%,8.05% 72.49%,4.03% 74.09%,3.68% 76.82%,0.00% 79.76%,0.00% 82.05%,10.59% 88.64%,24.85% 90.00%,26.29% 91.36%,26.29% 95.46%,35.04% 99.55%,37.97% 100.00%,49.25% 92.73%,53.28% 93.18%,59.49% 97.03%,65.71% 97.03%,70.83% 92.49%,81.01% 90.24%,86.48% 90.92%,93.44% 88.19%,90.51% 84.99%,90.16% 76.14%,92.00% 75.01%,98.91% 74.33%,100.00% 70.45%,95.28% 64.54%,81.01% 64.33%,79.22% 63.41%,78.83% 57.72%,74.80% 54.33%,75.20% 51.81%,76.99% 50.45%,87.97% 51.13%,90.16% 50.45%,82.11% 42.28%,83.95% 38.87%,83.20% 30.92%,79.92% 30.47%,71.52% 32.05%,60.59% 27.27%,51.09% 14.54%,42.00% 11.36%)",
  },
  donghae: {
    top: "69.18%",
    left: "89.06%",
    shapeTop: "65.37%",
    shapeLeft: "83.48%",
    shapeWidth: "8.96%",
    shapeHeight: "8.74%",
    clipPath: "polygon(95.09% 25.74%,87.72% 16.82%,59.82% 0.00%,31.14% 27.69%,4.91% 28.72%,0.00% 47.48%,4.91% 68.31%,0.78% 87.19%,2.46% 95.08%,14.73% 100.00%,41.74% 77.23%,62.28% 82.15%,72.10% 80.21%,100.00% 55.49%)",
  },
  jeongseon: {
    top: "77.06%",
    left: "72.69%",
    shapeTop: "63.81%",
    shapeLeft: "64.02%",
    shapeWidth: "19.68%",
    shapeHeight: "28.48%",
    clipPath: "polygon(82.83% 0.00%,79.47% 0.91%,75.00% 6.67%,76.88% 18.22%,75.00% 20.37%,66.82% 20.68%,62.70% 15.80%,50.41% 14.29%,45.17% 16.40%,36.94% 12.78%,29.47% 16.71%,25.00% 10.04%,21.65% 12.15%,21.65% 17.31%,18.29% 20.68%,19.05% 27.95%,17.17% 28.58%,13.47% 26.44%,13.06% 32.23%,11.59% 34.06%,4.88% 31.92%,1.12% 35.57%,2.24% 38.90%,0.00% 44.07%,3.35% 47.12%,7.88% 46.80%,11.94% 52.60%,11.23% 55.93%,16.82% 68.71%,20.53% 71.14%,14.58% 77.53%,15.29% 83.92%,20.53% 86.62%,27.24% 85.74%,28.35% 89.08%,32.47% 92.10%,44.05% 92.10%,50.76% 84.83%,59.71% 84.83%,70.53% 95.47%,79.12% 93.64%,85.06% 95.75%,85.47% 100.00%,88.06% 97.89%,87.70% 84.83%,76.47% 68.40%,78.76% 60.50%,75.76% 57.44%,75.76% 54.11%,78.00% 47.72%,81.71% 45.29%,82.47% 38.90%,92.17% 32.51%,98.53% 33.74%,100.00% 26.44%,97.76% 20.05%,100.00% 14.61%,95.88% 14.29%,92.94% 10.04%,86.94% 10.64%,85.06% 9.73%)",
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
              top: geometry[region.slug].shapeTop,
              left: geometry[region.slug].shapeLeft,
              width: geometry[region.slug].shapeWidth,
              height: geometry[region.slug].shapeHeight,
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
