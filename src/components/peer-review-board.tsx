"use client";

import { useState } from "react";
import { AlertTriangle, Check, ShieldAlert, Sparkles } from "lucide-react";
import { copy } from "@/lib/copy";
import { REPORT_REASONS, REPORT_REASON_LABEL } from "@/lib/constants";
import type { ChallengeCheckin, ReportReason } from "@/lib/types";
import { cn } from "@/lib/utils";
import { voteCheckin } from "@/lib/client-api";
import { IdentityAvatar, MaskedMedia, Panel, SectionLabel } from "@/components/bits";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { findCampus } from "@/lib/mock-data";

export function PeerReviewBoard({ queue }: { queue: ChallengeCheckin[] }) {
  const [votes, setVotes] = useState<
    Record<string, "approve" | "report" | undefined>
  >({});
  const [reportTarget, setReportTarget] = useState<ChallengeCheckin | null>(null);
  const [reasons, setReasons] = useState<ReportReason[]>([]);
  const [reportDone, setReportDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewed = Object.values(votes).filter(Boolean).length;

  function openReport(item: ChallengeCheckin) {
    setReportTarget(item);
    setReasons([]);
    setError(null);
    setReportDone(false);
  }

  function toggleReason(r: ReportReason) {
    setReasons((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
    );
    setError(null);
  }

  async function submitReport() {
    if (!reportTarget) return;
    if (reasons.length === 0) {
      setError(copy.challenge.report.chooseAtLeastOne);
      return;
    }
    await voteCheckin({
      checkinId: reportTarget.id,
      reviewerId: "u-self",
      verdict: "report",
      reasons,
    });
    setVotes((prev) => ({ ...prev, [reportTarget.id]: "report" }));
    setReportDone(true);
  }

  async function approve(item: ChallengeCheckin) {
    await voteCheckin({
      checkinId: item.id,
      reviewerId: "u-self",
      verdict: "approve",
    });
    setVotes((prev) => ({ ...prev, [item.id]: "approve" }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-[#00ff66]" />
          <SectionLabel>{copy.challenge.peerTitle}</SectionLabel>
        </div>
        <span className="lc-num text-[12px] text-white/40">
          {copy.challenge.reportsToday} {reviewed} / {queue.length}
        </span>
      </div>

      <p className="text-[12px] leading-relaxed text-white/45">
        {copy.challenge.peerHint}
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {queue.map((item) => {
          const campus = findCampus(item.campusId);
          const vote = votes[item.id];
          const settled = item.status !== "pending" || Boolean(vote);
          return (
            <Panel key={item.id} className="flex flex-col gap-3 p-4">
              <MaskedMedia seed={item.id} label={`Day ${item.day} · ${item.requiredGesture}`} className="h-40" />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <IdentityAvatar name={item.displayName} size="sm" />
                  <div className="flex flex-col">
                    <span className="text-[13px] text-white">{item.displayName}</span>
                    <span className="lc-num text-[10px] tracking-[0.12em] text-white/40">
                      {campus.shortName} · DAY {item.day}
                    </span>
                  </div>
                </div>
                {item.offlineProofRequired ? (
                  <span className="rounded-full border border-[#ffcc66]/40 bg-[#ffcc66]/10 px-2 py-0.5 text-[10px] text-[#ffcc66]">
                    {copy.common.offlineBadge}
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-3 text-[11px] text-white/45">
                <span className="inline-flex items-center gap-1">
                  <Check className="size-3 text-[#00ff66]" />
                  {item.approves + (vote === "approve" ? 1 : 0)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <AlertTriangle className="size-3 text-[#ff6b6b]" />
                  {item.reports + (vote === "report" ? 1 : 0)}
                </span>
                <span className="ml-auto">{item.requiredGesture}</span>
              </div>

              {vote ? (
                <div
                  className={cn(
                    "rounded-lg border px-3 py-2 text-[12px]",
                    vote === "approve"
                      ? "border-[#00ff66]/35 bg-[#00ff66]/10 text-[#00ff66]"
                      : "border-[#ff6b6b]/35 bg-[#ff6b6b]/10 text-[#ff9a9a]",
                  )}
                >
                  {vote === "approve" ? copy.challenge.approved : copy.challenge.reported}
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-[#00ff66] text-[12px] font-semibold text-black hover:bg-[#4dffa0]"
                    disabled={settled && item.status === "approved"}
                    onClick={() => approve(item)}
                  >
                    {copy.challenge.approveCta}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-[#3a1f1f] bg-[#1a1010] text-[12px] text-[#ff9a9a] hover:bg-[#221414] hover:text-[#ffb4b4]"
                    onClick={() => openReport(item)}
                  >
                    {copy.challenge.reportCta}
                  </Button>
                </div>
              )}
            </Panel>
          );
        })}
      </div>

      <Dialog
        open={Boolean(reportTarget)}
        onOpenChange={(next) => {
          if (!next) setReportTarget(null);
        }}
      >
        <DialogContent className="border border-[#242424] bg-[#0d0d0d] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[15px] text-white">
              <AlertTriangle className="size-4 text-[#ff6b6b]" />
              {copy.challenge.report.title}
            </DialogTitle>
            <DialogDescription className="text-[12px] leading-relaxed text-white/50">
              {copy.challenge.report.body}
            </DialogDescription>
          </DialogHeader>

          {reportDone ? (
            <div className="flex flex-col gap-3 rounded-xl border border-[#00ff66]/35 bg-[#00ff66]/[0.07] p-3">
              <p className="flex items-center gap-2 text-[13px] text-[#b9ffd4]">
                <Sparkles className="size-4 text-[#00ff66]" />
                {copy.challenge.report.submittedTitle}
              </p>
              <p className="text-[12px] text-white/50">
                {copy.challenge.report.submittedBody}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {REPORT_REASONS.map((r) => {
                const active = reasons.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleReason(r)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-[12px] transition-colors",
                      active
                        ? "border-[#ff6b6b]/50 bg-[#ff6b6b]/10 text-white"
                        : "border-[#232323] bg-[#111] text-white/60 hover:text-white",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded border",
                        active ? "border-[#ff6b6b] bg-[#ff6b6b]" : "border-[#3a3a3a]",
                      )}
                    >
                      {active ? <Check className="size-3 text-black" /> : null}
                    </span>
                    {REPORT_REASON_LABEL[r]}
                  </button>
                );
              })}
              <p className="mt-1 text-[11px] text-white/40">
                {copy.challenge.report.reward}
              </p>
              {error ? <p className="text-[12px] text-[#ff6b6b]">{error}</p> : null}
            </div>
          )}

          <DialogFooter className="gap-2 border-t border-[#1c1c1c] pt-4">
            {reportDone ? (
              <Button
                className="w-full bg-[#00ff66] text-black hover:bg-[#4dffa0]"
                onClick={() => setReportTarget(null)}
              >
                {copy.unlock.close}
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-white/50 hover:text-white"
                  onClick={() => setReportTarget(null)}
                >
                  取消
                </Button>
                <Button
                  className="flex-1 bg-[#ff6b6b] font-semibold text-black hover:bg-[#ff8f8f]"
                  onClick={submitReport}
                >
                  {copy.challenge.report.submit}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
