import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Dumbbell,
  Hand,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { copy } from "@/lib/copy";
import { CHALLENGE_DAYS, DEPOSIT_CENTS, TICKET_PRICE_CENTS } from "@/lib/constants";
import { formatCentsCompact } from "@/lib/format";
import { getCampusBoard, getLeaderboard } from "@/lib/data";
import { findCampus } from "@/lib/mock-data";
import {
  IdentityAvatar,
  LiveDot,
  Panel,
  PassBadge,
  RankMedal,
  SectionLabel,
  SectionTitle,
  StatBlock,
} from "@/components/bits";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** 当前奖金池（mock 展示值） */
const PRIZE_POOL_CENTS = 1_286_000;

export default async function HomePage() {
  const [entries, standings] = await Promise.all([
    getLeaderboard(),
    getCampusBoard(),
  ]);
  const top = entries.slice(0, 5);
  const topCampus = standings[0];
  const memberTotal = standings.reduce((s, c) => s + c.activeMembers, 0);
  const checkinTotal = standings.reduce((s, c) => s + c.checkins, 0);

  return (
    <div>
      <section className="lc-hero-glow border-b border-[#141414]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-16 sm:py-20">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <LiveDot />
              <span className="lc-label">{copy.home.eyebrow}</span>
            </div>
            <h1 className="max-w-3xl text-[34px] leading-[1.15] font-semibold tracking-tight text-white sm:text-[54px]">
              {copy.home.heroTitle}
            </h1>
            <p className="max-w-2xl text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
              {copy.home.heroBody}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/leaderboard"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "lc-glow h-11 bg-[#00ff66] px-5 text-[14px] font-semibold text-black hover:bg-[#4dffa0] hover:text-black",
                )}
              >
                {copy.home.ctaPrimary}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/challenge"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 border-[#262626] bg-[#101010] px-5 text-[14px] text-white/80 hover:bg-[#161616] hover:text-white",
                )}
              >
                {copy.home.ctaSecondary}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-[#171717] pt-8 sm:grid-cols-4">
            <StatBlock
              label={copy.home.statCampuses}
              value={String(standings.length)}
              accent
            />
            <StatBlock
              label={copy.home.statMembers}
              value={memberTotal.toLocaleString("zh-CN")}
            />
            <StatBlock
              label={copy.home.statCheckins}
              value={checkinTotal.toLocaleString("zh-CN")}
            />
            <StatBlock
              label={copy.home.statPrizePool}
              value={formatCentsCompact(PRIZE_POOL_CENTS)}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-5 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr]">
        <Panel className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel>{copy.home.livePreview}</SectionLabel>
            <span className="text-[11px] text-white/35">
              {copy.home.livePreviewHint}
            </span>
          </div>
          <div className="flex flex-col divide-y divide-[#161616]">
            {top.map((row) => {
              const campus = findCampus(row.campusId);
              return (
                <div key={row.userId} className="flex items-center gap-3 py-3">
                  <RankMedal rank={row.rank} />
                  <IdentityAvatar name={row.displayName} size="sm" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-[13px] text-white">
                      {row.displayName}
                    </span>
                    <span className="lc-num text-[10px] tracking-[0.12em] text-white/40">
                      {campus.shortName}
                    </span>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <PassBadge tier={row.passTier} locked={!row.passTier} />
                    <span className="lc-num w-10 text-right text-[14px] font-semibold text-[#00ff66]">
                      {row.leanIndex}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1.5 text-[12px] text-[#00ff66] underline-offset-4 hover:underline"
          >
            查看完整榜单
            <ArrowRight className="size-3.5" />
          </Link>
        </Panel>

        <div className="flex flex-col gap-5">
          {topCampus ? (
            <Panel className="flex flex-col gap-3 border-[#00ff66]/30 bg-[#00ff66]/[0.05] p-5">
              <div className="flex items-center justify-between">
                <SectionLabel>本季战队冠军</SectionLabel>
                <span className="rounded-full border border-[#00ff66]/45 bg-[#00ff66]/12 px-2.5 py-1 text-[10px] tracking-[0.12em] text-[#00ff66]">
                  {copy.leaderboard.topCampusBadge}
                </span>
              </div>
              <p className="text-[22px] font-semibold text-white">
                {topCampus.campus.name}
              </p>
              <p className="text-[12px] text-white/50">
                {topCampus.campus.city} · 平均薄肌指数 {topCampus.avgLeanIndex} ·
                打卡 {topCampus.checkins.toLocaleString("zh-CN")} 次
              </p>
            </Panel>
          ) : null}

          <Panel className="flex flex-col gap-4 p-5">
            <SectionLabel>{copy.home.howItWorks}</SectionLabel>
            <p className="text-[15px] font-medium text-white">
              {copy.home.proofTitle}
            </p>
            <div className="flex flex-col gap-3">
              {[
                { icon: Hand, text: "每日随机手势口令" },
                { icon: ShieldAlert, text: "打码后随机派发交叉审核" },
                { icon: Camera, text: "总榜前 10% 需线下合照背书" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-lg border border-[#232323] bg-[#121212]">
                    <item.icon className="size-4 text-[#00ff66]" />
                  </span>
                  <span className="text-[13px] text-white/70">{item.text}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <section className="border-t border-[#141414] bg-black">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-16">
          <div className="flex flex-col gap-3">
            <SectionLabel>{copy.home.programs}</SectionLabel>
            <SectionTitle>两条赛道，一套可验证的自律系统</SectionTitle>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {[
              {
                icon: TrendingUp,
                price: TICKET_PRICE_CENTS,
                title: copy.home.programATitle,
                body: copy.home.programABody,
                bullets: copy.home.programABullets,
                href: "/leaderboard",
              },
              {
                icon: Dumbbell,
                price: DEPOSIT_CENTS,
                title: copy.home.programBTitle,
                body: copy.home.programBBody,
                bullets: copy.home.programBBullets,
                href: "/challenge",
              },
            ].map((p) => (
              <Panel key={p.title} className="flex flex-col gap-5 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl border border-[#232323] bg-[#121212]">
                    <p.icon className="size-5 text-[#00ff66]" />
                  </span>
                  <span className="lc-num text-[15px] font-semibold text-white">
                    {formatCentsCompact(p.price)}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[19px] font-semibold text-white">
                    {p.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-white/55">
                    {p.body}
                  </p>
                </div>
                <ul className="flex flex-col gap-2 border-t border-[#1c1c1c] pt-4">
                  {p.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-[12px] text-white/60"
                    >
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#00ff66]" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className="mt-auto inline-flex items-center gap-1.5 text-[12px] text-[#00ff66] underline-offset-4 hover:underline"
                >
                  {copy.home.viewProgram}
                  <ArrowRight className="size-3.5" />
                </Link>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#141414]">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-16 sm:grid-cols-3">
          {copy.home.proofs.map((p) => (
            <div key={p.step} className="flex flex-col gap-3">
              <span className="lc-num text-[12px] tracking-[0.2em] text-[#00ff66]">
                {p.step}
              </span>
              <h3 className="text-[16px] font-semibold text-white">{p.title}</h3>
              <p className="text-[12px] leading-relaxed text-white/50">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#141414] bg-[#050505]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-5 px-5 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-[24px] font-semibold text-white sm:text-[30px]">
              {CHALLENGE_DAYS} 天之后，你会有证据
            </h2>
            <p className="text-[13px] text-white/50">
              缴纳 {formatCentsCompact(DEPOSIT_CENTS)} 押金，连续打卡全额退还。
            </p>
          </div>
          <Link
            href="/challenge"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 bg-[#00ff66] px-5 text-[14px] font-semibold text-black hover:bg-[#4dffa0] hover:text-black",
            )}
          >
            进入 21 天挑战
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
