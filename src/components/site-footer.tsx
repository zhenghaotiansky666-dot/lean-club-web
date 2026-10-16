import Link from "next/link";
import { copy } from "@/lib/copy";
import { REVENUE_SPLIT } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#1f1f1f] bg-black">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="text-[15px] font-semibold tracking-[0.14em] text-white">
            {copy.brand}
          </p>
          <p className="mt-1 text-[11px] tracking-[0.18em] text-white/35">
            {copy.tagline}
          </p>
          <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-white/40">
            {copy.footer.note}
          </p>
        </div>

        <div>
          <p className="lc-label">{copy.footer.links}</p>
          <div className="mt-4 flex flex-col gap-2 text-[13px] text-white/60">
            <Link href="/leaderboard" className="hover:text-white">
              {copy.nav.leaderboard}
            </Link>
            <Link href="/challenge" className="hover:text-white">
              {copy.nav.challenge}
            </Link>
            <Link href="/about" className="hover:text-white">
              {copy.nav.about}
            </Link>
          </div>
        </div>

        <div>
          <p className="lc-label">{copy.footer.revenue}</p>
          <div className="mt-4 flex flex-col gap-2 text-[13px] text-white/60">
            <span>
              {copy.about.revenueIp} · {REVENUE_SPLIT.ip}%
            </span>
            <span>
              {copy.about.revenuePlatform} · {REVENUE_SPLIT.platform}%
            </span>
            <span>
              {copy.about.revenueChapter} · {REVENUE_SPLIT.chapterFund}%
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
