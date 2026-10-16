import * as mock from "./mock";
import * as supabase from "./supabase";

/**
 * 数据访问层门面。
 * NEXT_PUBLIC_DATA_SOURCE=mock（默认）| supabase
 * 若声明 supabase 但未配置密钥，自动回退 mock 并在服务端打印提醒。
 */
const SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";

const useSupabase = SOURCE === "supabase" && supabase.isSupabaseConfigured();

if (SOURCE === "supabase" && !useSupabase && typeof window === "undefined") {
  console.warn(
    "[Lean Club] NEXT_PUBLIC_DATA_SOURCE=supabase 但未检测到 Supabase 密钥，已回退到 mock 数据源。",
  );
}

const impl = useSupabase ? supabase : mock;

export const getLeaderboard = impl.getLeaderboard;
export const getSelfEntry = impl.getSelfEntry;
export const getCampusBoard = impl.getCampusBoard;
export const getTodayChallenge = impl.getTodayChallenge;
export const getPeerReviewQueue = impl.getPeerReviewQueue;

export { createOrder, confirmOrder, getOrder, listOrders } from "./orders";
