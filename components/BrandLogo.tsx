import Image from "next/image";

export function BrandLogo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={`official-brand${className ? ` ${className}` : ""}`}>
      <Image
        src="/brand/hallym-glab.png"
        alt="한림 G Lab"
        width={627}
        height={149}
        priority={priority}
        unoptimized
        sizes="(max-width: 760px) 170px, 220px"
      />
    </span>
  );
}
