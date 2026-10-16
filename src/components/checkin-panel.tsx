"use client";

import { useRef, useState } from "react";
import {
  CalendarCheck,
  Check,
  Hand,
  Loader2,
  ShieldCheck,
  Upload,
  Wallet,
} from "lucide-react";
import { copy } from "@/lib/copy";
import { CHALLENGE_DAYS, DEPOSIT_CENTS } from "@/lib/constants";
import { formatCentsCompact, formatDateCN } from "@/lib/format";
import { submitCheckin } from "@/lib/client-api";
import type { DailyChallenge } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MaskedMedia, Panel, SectionLabel } from "@/components/bits";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UnlockDialog } from "@/components/unlock-dialog";
import { useUnlock } from "@/components/unlock-provider";

export function CheckinPanel({ challenge }: { challenge: DailyChallenge }) {
  const { deposit, unlockDeposit } = useUnlock();
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const progress = Math.round((challenge.day / challenge.totalDays) * 100);

  async function submit() {
    setSubmitting(true);
    // 写入统一走客户端通道（Node 环境为 Route Handler；静态演示在浏览器内生成）
    await submitCheckin({
      userId: "u-self",
      day: challenge.day,
      gesture: challenge.requiredGesture,
    });
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <Panel className="flex flex-col gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="size-4 text-[#00ff66]" />
            <SectionLabel>{copy.challenge.progressTitle}</SectionLabel>
          </div>
          <span className="lc-num text-[12px] text-white/50">
            {copy.challenge.progressOf} {challenge.day} / {challenge.totalDays} {copy.common.days}
          </span>
        </div>

        <Progress value={progress} className="w-full" />

        <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-11 lg:grid-cols-7">
          {Array.from({ length: CHALLENGE_DAYS }, (_, i) => i + 1).map((d) => {
            const done = d < challenge.day;
            const today = d === challenge.day;
            return (
              <span
                key={d}
                className={cn(
                  "lc-num flex h-7 items-center justify-center rounded-md border text-[11px]",
                  today
                    ? "border-[#00ff66]/60 bg-[#00ff66]/15 text-[#00ff66]"
                    : done
                      ? "border-[#1f1f1f] bg-[#151515] text-white/45"
                      : "border-[#191919] bg-[#0d0d0d] text-white/25",
                )}
              >
                {d}
              </span>
            );
          })}
        </div>

        <div className="rounded-xl border border-[#00ff66]/25 bg-[#00ff66]/[0.05] p-4">
          <div className="flex items-center gap-2">
            <Hand className="size-4 text-[#00ff66]" />
            <span className="lc-label">{copy.challenge.todayGestureLabel}</span>
          </div>
          <p className="mt-2 text-[20px] font-semibold tracking-tight text-white">
            {challenge.requiredGesture}
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-white/50">
            <span className="text-white/35">{copy.challenge.todayHintLabel}：</span>
            {challenge.gestureHint}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-[#1c1c1c] pt-4 text-[12px]">
          <div className="flex flex-col gap-1">
            <span className="lc-label">{copy.challenge.checkedInToday}</span>
            <span className="lc-num text-[15px] text-white">
              {challenge.checkedInToday} {copy.common.people}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="lc-label">{copy.challenge.pendingReviews}</span>
            <span className="lc-num text-[15px] text-white">
              {challenge.pendingReviews} {copy.common.times}
            </span>
          </div>
        </div>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel>{copy.challenge.uploadTitle}</SectionLabel>
            <span className="lc-num text-[11px] text-white/35">
              {formatDateCN(challenge.date)}
            </span>
          </div>

          <MaskedMedia
            seed={fileName ?? "lean-club-self"}
            label={fileName ?? "等待选择素材"}
            className="h-36"
          />

          <p className="text-[11px] leading-relaxed text-white/40">
            {copy.challenge.maskedNote}
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setFileName(f.name);
                setSubmitted(false);
              }
            }}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-[#242424] bg-[#101010] text-white/70 hover:text-white"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="size-4" />
              {fileName ? copy.challenge.uploadChosen : copy.challenge.uploadCta}
            </Button>
            <Button
              className="flex-1 bg-[#00ff66] font-semibold text-black hover:bg-[#4dffa0]"
              disabled={!fileName || submitting || submitted}
              onClick={submit}
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : submitted ? (
                <Check className="size-4" />
              ) : null}
              {submitted ? copy.challenge.submitted : copy.challenge.submitCta}
            </Button>
          </div>
        </Panel>

        <Panel className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2">
            <Wallet className="size-4 text-[#00ff66]" />
            <SectionLabel>{copy.challenge.depositLabel}</SectionLabel>
          </div>
          <p className="lc-num text-2xl font-semibold text-white">
            {formatCentsCompact(DEPOSIT_CENTS)}
          </p>
          <p className="text-[12px] leading-relaxed text-white/50">
            {copy.challenge.refundNote}
          </p>
          <p className="text-[11px] leading-relaxed text-white/35">
            {copy.challenge.prizeNote}
          </p>
          {deposit ? (
            <span className="inline-flex items-center gap-2 rounded-lg border border-[#00ff66]/40 bg-[#00ff66]/10 px-3 py-2 text-[12px] text-[#00ff66]">
              <ShieldCheck className="size-3.5" />
              押金已缴纳 · 参赛中
            </span>
          ) : (
            <Button
              className="bg-[#00ff66] font-semibold text-black hover:bg-[#4dffa0]"
              onClick={() => setDepositOpen(true)}
            >
              缴纳押金参赛 · {formatCentsCompact(DEPOSIT_CENTS)}
            </Button>
          )}
        </Panel>
      </div>

      <UnlockDialog
        open={depositOpen}
        onOpenChange={setDepositOpen}
        sku="challenge_deposit_100"
        onPaid={(order) => unlockDeposit(order.orderId)}
      />
    </div>
  );
}
