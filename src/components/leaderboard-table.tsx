"use client";

import { useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { copy } from "@/lib/copy";
import { TICKET_PRICE_CENTS } from "@/lib/constants";
import { formatCentsCompact } from "@/lib/format";
import { findCampus } from "@/lib/mock-data";
import type { LeaderboardEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  IdentityAvatar,
  PassBadge,
  RankMedal,
  SectionLabel,
} from "@/components/bits";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UnlockDialog } from "@/components/unlock-dialog";
import { useUnlock } from "@/components/unlock-provider";

export function LeaderboardTable({
  entries,
  selfEntry,
}: {
  entries: LeaderboardEntry[];
  selfEntry: LeaderboardEntry;
}) {
  const { ticket, unlockTicket } = useUnlock();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const base = ticket
      ? [...entries, selfEntry]
      : [...entries];
    return base
      .sort((a, b) => b.leanIndex - a.leanIndex)
      .map((e, i) => ({ ...e, rank: i + 1 }))
      .filter((e) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          e.displayName.toLowerCase().includes(q) ||
          findCampus(e.campusId).name.includes(q) ||
          findCampus(e.campusId).shortName.toLowerCase().includes(q)
        );
      });
  }, [entries, selfEntry, ticket, query]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <SectionLabel>{copy.leaderboard.tabsPersonal}</SectionLabel>
          <span className="lc-num text-[12px] text-white/35">
            {entries.length + (ticket ? 1 : 0)} {copy.leaderboard.totalAthletes}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.leaderboard.searchPlaceholder}
            aria-label={copy.leaderboard.searchPlaceholder}
            className="h-9 w-full max-w-[240px] rounded-lg border border-[#242424] bg-[#0f0f0f] px-3 text-[13px] text-white placeholder:text-white/30 focus:border-[#00ff66]/50 focus:outline-none"
          />
          {ticket ? (
            <span className="hidden rounded-lg border border-[#00ff66]/40 bg-[#00ff66]/10 px-3 py-1.5 text-[12px] text-[#00ff66] sm:inline-flex">
              {copy.leaderboard.joinedCta}
            </span>
          ) : (
            <Button
              className="h-9 bg-[#00ff66] text-[13px] font-semibold text-black hover:bg-[#4dffa0]"
              onClick={() => setOpen(true)}
            >
              {copy.leaderboard.joinCta}
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#1f1f1f] bg-[#0d0d0d]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1c1c1c] hover:bg-transparent">
              <TableHead className="w-16 pl-4">{copy.leaderboard.columns.rank}</TableHead>
              <TableHead>{copy.leaderboard.columns.athlete}</TableHead>
              <TableHead className="hidden sm:table-cell">
                {copy.leaderboard.columns.campus}
              </TableHead>
              <TableHead className="text-right">
                {copy.leaderboard.columns.leanIndex}
              </TableHead>
              <TableHead className="hidden text-right md:table-cell">
                {copy.leaderboard.columns.checkinDays}
              </TableHead>
              <TableHead className="hidden text-right md:table-cell">
                {copy.leaderboard.columns.streak}
              </TableHead>
              <TableHead className="pr-4 text-right">
                {copy.leaderboard.columns.pass}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!ticket ? (
              <TableRow className="border-[#161616] bg-[#101010]/60">
                <TableCell className="pl-4">
                  <span className="lc-num inline-flex size-8 items-center justify-center rounded-md border border-dashed border-[#2c2c2c] text-white/30">
                    —
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-10 items-center justify-center rounded-full border border-dashed border-[#2c2c2c]">
                      <Lock className="size-4 text-white/30" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[13px] text-white/60">
                        {copy.leaderboard.yourSeat}
                      </span>
                      <span className="text-[11px] text-white/30">
                        {copy.leaderboard.yourSeatHint}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-white/40 sm:table-cell">
                  澳门科技大学 · MUST
                </TableCell>
                <TableCell className="text-right text-white/30">—</TableCell>
                <TableCell className="hidden text-right text-white/30 md:table-cell">
                  —
                </TableCell>
                <TableCell className="hidden text-right text-white/30 md:table-cell">
                  —
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <button
                    onClick={() => setOpen(true)}
                    className="text-[12px] text-[#00ff66] underline-offset-4 hover:underline"
                  >
                    {formatCentsCompact(TICKET_PRICE_CENTS)} 解锁
                  </button>
                </TableCell>
              </TableRow>
            ) : null}

            {rows.map((row) => {
              const campus = findCampus(row.campusId);
              return (
                <TableRow
                  key={row.userId}
                  className={cn(
                    "border-[#161616]",
                    row.isSelf
                      ? "bg-[#00ff66]/[0.06] hover:bg-[#00ff66]/[0.09]"
                      : "hover:bg-white/[0.02]",
                  )}
                >
                  <TableCell className="pl-4">
                    <RankMedal rank={row.rank} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <IdentityAvatar name={row.displayName} ring={row.isSelf} />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-white">
                          {row.displayName}
                        </span>
                        {row.isSelf ? (
                          <span className="text-[10px] tracking-[0.16em] text-[#00ff66]">
                            YOUR SEAT
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-[12px] text-white/70">
                      {campus.name}
                    </span>
                    <span className="ml-1.5 text-[10px] tracking-[0.14em] text-white/35">
                      {campus.shortName}
                    </span>
                  </TableCell>
                  <TableCell className="lc-num text-right text-[13px] font-semibold text-white">
                    {row.leanIndex}
                  </TableCell>
                  <TableCell className="lc-num hidden text-right text-[13px] text-white/70 md:table-cell">
                    {row.checkinDays}
                  </TableCell>
                  <TableCell className="lc-num hidden text-right text-[13px] text-white/50 md:table-cell">
                    {row.streak}
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <PassBadge tier={row.passTier} locked={!row.passTier} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <UnlockDialog
        open={open}
        onOpenChange={setOpen}
        onPaid={(order) => unlockTicket(order.orderId)}
      />
    </div>
  );
}
