import { MapPin, ShieldCheck, Users } from "lucide-react";
import { copy } from "@/lib/copy";
import type { CampusStanding } from "@/lib/types";
import { cn } from "@/lib/utils";
import { RankMedal } from "@/components/bits";

export function CampusBoard({ standings }: { standings: CampusStanding[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {standings.map((s) => (
        <div
          key={s.campus.id}
          className={cn(
            "flex flex-col gap-4 rounded-2xl border p-4",
            s.isTopCampus
              ? "border-[#00ff66]/40 bg-[#00ff66]/[0.06]"
              : "border-[#1f1f1f] bg-[#0f0f0f]",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <RankMedal rank={s.rank} />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-white">
                  {s.campus.name}
                </span>
                <span className="lc-num text-[10px] tracking-[0.16em] text-white/40">
                  {s.campus.shortName}
                </span>
              </div>
            </div>
            {s.isTopCampus ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#00ff66]/45 bg-[#00ff66]/12 px-2.5 py-1 text-[10px] tracking-[0.12em] text-[#00ff66]">
                <ShieldCheck className="size-3" />
                {copy.leaderboard.topCampusBadge}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 text-[12px] text-white/60">
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5 text-white/35" />
              {s.campus.city} · {s.campus.country}
            </span>
            <span className="flex items-center gap-2">
              <Users className="size-3.5 text-white/35" />
              {s.activeMembers.toLocaleString("zh-CN")} {copy.common.people}已打卡
            </span>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[#1c1c1c] pt-3">
            <div className="flex flex-col">
              <span className="lc-label">{copy.leaderboard.campusColumns.checkins}</span>
              <span className="lc-num mt-1 text-[15px] text-white">
                {s.checkins.toLocaleString("zh-CN")}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="lc-label">{copy.leaderboard.campusColumns.avgIndex}</span>
              <span className="lc-num mt-1 text-[15px] text-white">
                {s.avgLeanIndex}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
