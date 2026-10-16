import type { Metadata } from "next";
import { Info } from "lucide-react";
import { copy } from "@/lib/copy";
import { formatCentsCompact, formatPercent } from "@/lib/format";
import { DEPOSIT_CENTS, TOP_PERCENT_FOR_OFFLINE_PROOF } from "@/lib/constants";
import { getPeerReviewQueue, getTodayChallenge } from "@/lib/data";
import { CheckinPanel } from "@/components/checkin-panel";
import { PeerReviewBoard } from "@/components/peer-review-board";
import { Panel, SectionLabel } from "@/components/bits";

export const metadata: Metadata = {
  title: copy.challenge.title,
};

export default async function ChallengePage() {
  const [challenge, queue] = await Promise.all([
    getTodayChallenge(),
    getPeerReviewQueue(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-14">
      <header className="flex flex-col gap-4 border-b border-[#171717] pb-8">
        <SectionLabel>{copy.challenge.eyebrow}</SectionLabel>
        <h1 className="text-[30px] font-semibold tracking-tight text-white sm:text-[42px]">
          {copy.challenge.title}
        </h1>
        <p className="max-w-2xl text-[14px] leading-relaxed text-white/55">
          {copy.challenge.body}
        </p>
        <div className="flex flex-wrap gap-3 text-[12px]">
          <span className="rounded-lg border border-[#232323] bg-[#101010] px-3 py-1.5 text-white/60">
            {copy.challenge.depositLabel} {formatCentsCompact(DEPOSIT_CENTS)}
          </span>
          <span className="rounded-lg border border-[#00ff66]/35 bg-[#00ff66]/[0.08] px-3 py-1.5 text-[#00ff66]">
            {copy.challenge.refundNote}
          </span>
          <span className="rounded-lg border border-[#232323] bg-[#101010] px-3 py-1.5 text-white/60">
            总榜前 {formatPercent(TOP_PERCENT_FOR_OFFLINE_PROOF)} 需线下背书
          </span>
        </div>
      </header>

      <CheckinPanel challenge={challenge} />

      <section className="flex flex-col gap-5">
        <PeerReviewBoard queue={queue} />
      </section>

      <Panel className="flex items-start gap-3 border-[#2a2418] bg-[#14110a] p-5">
        <Info className="mt-0.5 size-4 shrink-0 text-[#ffcc66]" />
        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-medium text-[#ffcc66]">
            {copy.challenge.offlineTitle}
          </p>
          <p className="text-[12px] leading-relaxed text-white/50">
            {copy.challenge.offlineBody}
          </p>
        </div>
      </Panel>
    </div>
  );
}
