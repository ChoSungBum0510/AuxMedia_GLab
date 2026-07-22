import Image from "next/image";
import type { RegionInfo } from "../lib/content";

export function RegionBadge({ region, compact = false, dark = false }: { region: RegionInfo; compact?: boolean; dark?: boolean }) {
  const useFilteredDarkLogo = dark && !region.logoDark;
  return (
    <span
      className={`region-badge${compact ? " region-badge--compact" : ""}${useFilteredDarkLogo ? " region-badge--filtered-dark" : ""}`}
      aria-label={region.displayName}
    >
      <Image
        src={dark && region.logoDark ? region.logoDark : region.logo}
        alt={region.displayName}
        width={region.logoWidth ?? 648}
        height={region.logoHeight ?? 107}
        unoptimized
        sizes={compact ? "160px" : "220px"}
      />
    </span>
  );
}
