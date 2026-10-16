import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatCentsCompact, gradientFor, initials } from "@/lib/format";
import type { PassTier } from "@/lib/types";

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("lc-label", className)}>{children}</p>;
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-2xl font-semibold tracking-tight text-white sm:text-[32px]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("lc-panel rounded-2xl", className)}>{children}</div>
  );
}

export function StatBlock({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="lc-label">{label}</span>
      <span
        className={cn(
          "lc-num text-2xl font-semibold sm:text-[28px]",
          accent ? "text-[#00ff66]" : "text-white",
        )}
      >
        {value}
        {unit ? (
          <span className="ml-1 text-sm font-normal text-white/40">{unit}</span>
        ) : null}
      </span>
    </div>
  );
}

export function IdentityAvatar({
  name,
  size = "md",
  ring,
}: {
  name: string;
  size?: "sm" | "md";
  ring?: boolean;
}) {
  return (
    <Avatar
      className={cn(
        size === "sm" ? "size-8" : "size-10",
        ring && "ring-1 ring-[#00ff66]/50",
      )}
    >
      <AvatarFallback
        className="text-[12px] font-semibold text-white/90"
        style={{ backgroundImage: gradientFor(name) }}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

const TIER_LABEL: Record<PassTier, string> = {
  founder: "FOUNDER",
  gold: "GOLD",
  silver: "SILVER",
  bronze: "BRONZE",
};

export function PassBadge({
  tier,
  locked,
}: {
  tier?: PassTier;
  locked?: boolean;
}) {
  if (locked || !tier) {
    return (
      <Badge
        variant="outline"
        className="border-[#2a2a2a] bg-transparent text-[10px] tracking-[0.14em] text-white/35"
      >
        LOCKED
      </Badge>
    );
  }
  const strong = tier === "founder" || tier === "gold";
  return (
    <Badge
      className={cn(
        "border text-[10px] tracking-[0.14em]",
        strong
          ? "border-[#00ff66]/45 bg-[#00ff66]/12 text-[#00ff66]"
          : "border-white/15 bg-white/[0.04] text-white/70",
      )}
    >
      PASS · {TIER_LABEL[tier]}
    </Badge>
  );
}

export function RankMedal({ rank }: { rank: number }) {
  const top = rank <= 3;
  return (
    <span
      className={cn(
        "lc-num inline-flex size-8 items-center justify-center rounded-md border text-[13px] font-semibold",
        top
          ? "border-[#00ff66]/45 bg-[#00ff66]/10 text-[#00ff66]"
          : "border-[#232323] bg-[#141414] text-white/60",
      )}
    >
      {rank}
    </span>
  );
}

/** 打卡素材占位：真实环境是自动打码后的图片 / 视频 */
export function MaskedMedia({
  seed,
  label,
  className,
}: {
  seed: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-[#232323]",
        className,
      )}
    >
      <div
        className="lc-masked absolute inset-0"
        style={{ backgroundImage: gradientFor(seed) }}
      />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_4px)]" />
      <div className="relative flex h-full flex-col items-center justify-center gap-1.5 p-4 text-center">
        <span className="rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10px] tracking-[0.16em] text-white/80">
          已自动打码
        </span>
        {label ? (
          <span className="text-[11px] text-white/60">{label}</span>
        ) : null}
      </div>
    </div>
  );
}

export function PriceTag({ cents }: { cents: number }) {
  return (
    <span className="lc-num text-[#00ff66]">{formatCentsCompact(cents)}</span>
  );
}

export function LiveDot() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#00ff66] opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-[#00ff66]" />
      </span>
      <span className="lc-label">LIVE</span>
    </span>
  );
}
