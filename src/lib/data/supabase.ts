import type {
  CampusStanding,
  ChallengeCheckin,
  DailyChallenge,
  LeaderboardEntry,
} from "../types";

/**
 * Supabase 数据源（预留）。
 *
 * 启用方式：
 *   1) 在 Supabase 新建项目，执行 supabase/schema.sql
 *   2) .env.local 写入
 *        NEXT_PUBLIC_DATA_SOURCE=supabase
 *        NEXT_PUBLIC_SUPABASE_URL=...
 *        NEXT_PUBLIC_SUPABASE_ANON_KEY=...
 *   3) pnpm add @supabase/supabase-js
 *
 * 未完成上述配置时，app 会自动回退到 mock 数据源（见 ./index.ts），
 * 因此本文件在 MVP 阶段不会被真正调用。
 */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function notConfigured(): never {
  throw new Error(
    "Supabase 数据源尚未配置：请设置 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY，并执行 supabase/schema.sql。",
  );
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  "use cache";
  notConfigured();
}

export async function getSelfEntry(): Promise<LeaderboardEntry> {
  "use cache";
  notConfigured();
}

export async function getCampusBoard(): Promise<CampusStanding[]> {
  "use cache";
  notConfigured();
}

export async function getTodayChallenge(): Promise<DailyChallenge> {
  "use cache";
  notConfigured();
}

export async function getPeerReviewQueue(): Promise<ChallengeCheckin[]> {
  "use cache";
  notConfigured();
}
