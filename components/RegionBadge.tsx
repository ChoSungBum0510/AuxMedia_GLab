import type { RegionInfo } from "../lib/content";

export function RegionBadge({ region, compact = false }: { region: RegionInfo; compact?: boolean }) {
  return (
    <span
      className={`region-badge${compact ? " region-badge--compact" : ""}`}
      style={{ "--region-color": region.color } as React.CSSProperties}
      aria-label={`${region.koreanName} GLab`}
    >
      <span className="region-badge__mark" aria-hidden="true">
        <span>{region.shortCode}</span>
      </span>
      <span className="region-badge__text">
        <strong>{region.koreanName}</strong>
        {!compact && <small>GLab</small>}
      </span>
    </span>
  );
}
