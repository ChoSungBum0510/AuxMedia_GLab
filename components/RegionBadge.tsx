import Image from "next/image";
import type { RegionInfo } from "../lib/content";

export function RegionBadge({ region, compact = false }: { region: RegionInfo; compact?: boolean }) {
  return (
    <span
      className={`region-badge${compact ? " region-badge--compact" : ""}`}
      aria-label={`${region.koreanName} GLab`}
    >
      <Image
        src={region.logo}
        alt={`한림 G Lab @${region.koreanName}`}
        width={648}
        height={107}
        unoptimized
        sizes={compact ? "160px" : "220px"}
      />
    </span>
  );
}
