import type { Metadata } from "next";
import { Mail, ShieldCheck } from "lucide-react";
import { copy } from "@/lib/copy";
import { REVENUE_SPLIT } from "@/lib/constants";
import { getCampusBoard } from "@/lib/data";
import { Panel, SectionLabel, SectionTitle } from "@/components/bits";

export const metadata: Metadata = {
  title: copy.about.title,
};

const SPLIT_ROWS = [
  { key: "ip", label: copy.about.revenueIp, value: REVENUE_SPLIT.ip },
  {
    key: "platform",
    label: copy.about.revenuePlatform,
    value: REVENUE_SPLIT.platform,
  },
  {
    key: "chapter",
    label: copy.about.revenueChapter,
    value: REVENUE_SPLIT.chapterFund,
  },
] as const;

export default async function AboutPage() {
  const standings = await getCampusBoard();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 py-14">
      <header className="flex flex-col gap-4 border-b border-[#171717] pb-8">
        <SectionLabel>{copy.about.eyebrow}</SectionLabel>
        <h1 className="text-[30px] font-semibold tracking-tight text-white sm:text-[42px]">
          {copy.about.title}
        </h1>
        <p className="max-w-3xl text-[14px] leading-relaxed text-white/55">
          {copy.about.body}
        </p>
      </header>

      <section className="grid gap-5 lg:grid-cols-2">
        <Panel className="flex flex-col gap-3 p-6">
          <SectionTitle className="text-[20px] sm:text-[22px]">
            {copy.about.storyTitle}
          </SectionTitle>
          <p className="text-[13px] leading-relaxed text-white/55">
            {copy.about.storyBody}
          </p>
        </Panel>
        <Panel className="flex flex-col gap-3 p-6">
          <SectionTitle className="text-[20px] sm:text-[22px]">
            {copy.about.chaptersTitle}
          </SectionTitle>
          <p className="text-[13px] leading-relaxed text-white/55">
            {copy.about.chaptersBody}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {standings.map((s) => (
              <span
                key={s.campus.id}
                className="lc-num rounded-lg border border-[#232323] bg-[#101010] px-2.5 py-1 text-[11px] tracking-[0.12em] text-white/60"
              >
                {s.campus.shortName}
              </span>
            ))}
          </div>
        </Panel>
      </section>

      <section className="flex flex-col gap-6">
        <SectionTitle>{copy.about.rulesTitle}</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {copy.about.rules.map((r) => (
            <Panel key={r.title} className="flex flex-col gap-2 p-5">
              <p className="text-[14px] font-medium text-white">{r.title}</p>
              <p className="text-[12px] leading-relaxed text-white/50">
                {r.body}
              </p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Panel className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-[#00ff66]" />
            <SectionLabel>{copy.about.revenueTitle}</SectionLabel>
          </div>
          <p className="text-[12px] leading-relaxed text-white/50">
            {copy.about.revenueBody}
          </p>
          <div className="flex flex-col gap-3 border-t border-[#1c1c1c] pt-4">
            {SPLIT_ROWS.map((row) => (
              <div key={row.key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-white/65">{row.label}</span>
                  <span className="lc-num text-white">{row.value}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#1a1a1a]">
                  <div
                    className="h-full rounded-full bg-[#00ff66]"
                    style={{ width: `${row.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="flex flex-col gap-4 p-6">
          <SectionLabel>{copy.about.roadmapTitle}</SectionLabel>
          <ul className="flex flex-col gap-3">
            {copy.about.roadmap.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[12px] text-white/60"
              >
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#00ff66]" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-start gap-2 border-t border-[#1c1c1c] pt-4 text-[12px] text-white/50">
            <Mail className="mt-0.5 size-3.5 shrink-0 text-white/35" />
            <span>
              {copy.about.contact}：{copy.about.contactBody}
            </span>
          </div>
        </Panel>
      </section>
    </div>
  );
}
