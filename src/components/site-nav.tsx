"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { formatCentsCompact } from "@/lib/format";
import { TICKET_PRICE_CENTS } from "@/lib/constants";
import { useUnlock } from "@/components/unlock-provider";
import { buttonVariants } from "@/components/ui/button";

const LINKS = [
  { href: "/", label: copy.nav.home },
  { href: "/leaderboard", label: copy.nav.leaderboard },
  { href: "/challenge", label: copy.nav.challenge },
  { href: "/about", label: copy.nav.about },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const { ticket } = useUnlock();

  return (
    <header className="sticky top-0 z-40 border-b border-[#1f1f1f] bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-5">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex size-7 items-center justify-center rounded-md border border-[#00ff66]/40 bg-[#00ff66]/10">
            <Flame className="size-4 text-[#00ff66]" strokeWidth={2.4} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-[0.14em] text-white">
              LEAN CLUB
            </span>
            <span className="mt-1 text-[10px] tracking-[0.18em] text-white/35">
              {copy.tagline}
            </span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-[13px] transition-colors",
                  active
                    ? "bg-white/[0.06] text-white"
                    : "text-white/50 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {ticket ? (
            <span className="hidden items-center gap-2 rounded-full border border-[#00ff66]/35 bg-[#00ff66]/10 px-3 py-1.5 text-[11px] tracking-[0.14em] text-[#00ff66] sm:inline-flex">
              PASS ACTIVE
            </span>
          ) : null}
          <Link
            href="/leaderboard"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-9 bg-[#00ff66] px-4 text-[13px] font-semibold text-black hover:bg-[#4dffa0] hover:text-black",
            )}
          >
            加入 · {formatCentsCompact(TICKET_PRICE_CENTS)}
          </Link>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-[#161616] px-5 py-2 md:hidden">
        {LINKS.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-[13px]",
                active ? "bg-white/[0.06] text-white" : "text-white/50",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
