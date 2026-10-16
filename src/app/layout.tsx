import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { UnlockProvider } from "@/components/unlock-provider";
import { copy } from "@/lib/copy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${copy.brand} · ${copy.brandCn}`,
    template: `%s · ${copy.brand}`,
  },
  description: copy.taglineCn,
  applicationName: copy.brand,
  keywords: [
    "薄肌俱乐部",
    "Lean Club",
    "全球薄肌排行榜",
    "21天挑战",
    "澳门科技大学",
    "高校战队",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="lc-grid-bg flex min-h-full flex-col bg-black">
        <UnlockProvider>
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </UnlockProvider>
      </body>
    </html>
  );
}
