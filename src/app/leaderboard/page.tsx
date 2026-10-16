import type { Metadata } from "next";
import { copy } from "@/lib/copy";
import { getCampusBoard, getLeaderboard, getSelfEntry } from "@/lib/data";
import { CampusBoard } from "@/components/campus-board";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { LeaderboardTabs } from "@/components/leaderboard-tabs";
import { SectionLabel } from "@/components/bits";

export const metadata: Metadata = {
  title: copy.leaderboard.title,
};

export default async function LeaderboardPage() {
  const [entries, selfEntry, standings] = await Promise.all([
    getLeaderboard(),
    getSelfEntry(),
    getCampusBoard(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-14">
      <header className="flex flex-col gap-4 border-b border-[#171717] pb-8">
        <SectionLabel>{copy.leaderboard.eyebrow}</SectionLabel>
        <h1 className="text-[30px] font-semibold tracking-tight text-white sm:text-[42px]">
          {copy.leaderboard.title}
        </h1>
        <p className="max-w-2xl text-[14px] leading-relaxed text-white/55">
          {copy.leaderboard.body}
        </p>
      </header>

      <LeaderboardTabs
        personal={<LeaderboardTable entries={entries} selfEntry={selfEntry} />}
        campus={
          <div className="flex flex-col gap-4">
            <p className="text-[12px] leading-relaxed text-white/45">
              {copy.leaderboard.topCampusHint}
            </p>
            <CampusBoard standings={standings} />
          </div>
        }
      />
    </div>
  );
}
