import {
  CHALLENGE_DAYS,
  GESTURE_POOL,
} from "./constants";
import type {
  Campus,
  ChallengeCheckin,
  LeaderboardEntry,
  PassTier,
} from "./types";

/** 已接入的高校 / 城市战队 */
export const CAMPUSES: Campus[] = [
  {
    id: "must",
    name: "澳门科技大学",
    nameEn: "Macau University of Science and Technology",
    shortName: "MUST",
    city: "澳门",
    country: "中国澳门",
    memberCount: 1286,
    checkinCount: 18422,
  },
  {
    id: "hku",
    name: "香港大学",
    nameEn: "The University of Hong Kong",
    shortName: "HKU",
    city: "香港",
    country: "中国香港",
    memberCount: 1204,
    checkinCount: 17988,
  },
  {
    id: "xjtl",
    name: "西交利物浦大学",
    nameEn: "Xi'an Jiaotong-Liverpool University",
    shortName: "XJTLU",
    city: "苏州",
    country: "中国",
    memberCount: 986,
    checkinCount: 13240,
  },
  {
    id: "unnc",
    name: "宁波诺丁汉大学",
    nameEn: "University of Nottingham Ningbo China",
    shortName: "UNNC",
    city: "宁波",
    country: "中国",
    memberCount: 742,
    checkinCount: 9860,
  },
  {
    id: "cuhk",
    name: "香港中文大学",
    nameEn: "The Chinese University of Hong Kong",
    shortName: "CUHK",
    city: "香港",
    country: "中国香港",
    memberCount: 668,
    checkinCount: 8412,
  },
  {
    id: "um",
    name: "澳门大学",
    nameEn: "University of Macau",
    shortName: "UM",
    city: "澳门",
    country: "中国澳门",
    memberCount: 594,
    checkinCount: 7180,
  },
];

type Seed = [
  name: string,
  campusId: Campus["id"],
  checkinDays: number,
  streak: number,
  leanIndex: number,
  tier?: PassTier,
];

const SEEDS: Seed[] = [
  ["林子扬", "must", 21, 21, 96, "founder"],
  ["Wing Chan", "hku", 21, 19, 94, "founder"],
  ["陈可儿", "xjtl", 21, 21, 93, "founder"],
  ["赵一鸣", "must", 20, 17, 91, "gold"],
  ["何思远", "hku", 20, 20, 90, "gold"],
  ["沈亦航", "unnc", 19, 14, 88, "gold"],
  ["李知微", "must", 19, 19, 87, "gold"],
  ["Alex Tse", "cuhk", 18, 12, 85, "gold"],
  ["吴佩琪", "hku", 18, 18, 84, "silver"],
  ["周予安", "xjtl", 17, 11, 82, "silver"],
  ["邓皓文", "um", 17, 17, 81, "silver"],
  ["Kiki Lam", "must", 16, 9, 79, "silver"],
  ["黄嘉煜", "hku", 16, 16, 78, "silver"],
  ["郑斯允", "unnc", 15, 8, 76, "silver"],
  ["杨云舒", "xjtl", 15, 15, 75, "bronze"],
  ["Kelvin Ng", "cuhk", 14, 7, 73, "bronze"],
  ["徐若彤", "must", 14, 14, 72, "bronze"],
  ["刘星野", "um", 13, 6, 70, "bronze"],
  ["苏晗", "hku", 13, 13, 69, "bronze"],
  ["Ryan Ho", "unnc", 12, 5, 67],
  ["樊亦辰", "xjtl", 12, 12, 66],
  ["唐未", "must", 11, 4, 64],
  ["Ivan Leong", "um", 10, 3, 61],
  ["彭雨桐", "cuhk", 9, 2, 58],
];

export const LEADERBOARD: LeaderboardEntry[] = SEEDS.map((s, i) => ({
  rank: i + 1,
  userId: `u-${String(i + 1).padStart(3, "0")}`,
  displayName: s[0],
  campusId: s[1],
  checkinDays: s[2],
  streak: s[3],
  leanIndex: s[4],
  passTier: s[5],
}));

/** 本机用户解锁后注入榜单的席位数据 */
export const SELF_ENTRY_SEED = {
  checkinDays: 12,
  streak: 6,
  leanIndex: 77,
  passTier: "gold" as PassTier,
};

/** 今日挑战（mock：第 7 天） */
export const TODAY_INDEX = 6; // 0-based → Day 7
export const TODAY_GESTURE = GESTURE_POOL[TODAY_INDEX % GESTURE_POOL.length];

export const DAILY_CHALLENGE = {
  day: TODAY_INDEX + 1,
  totalDays: CHALLENGE_DAYS,
  date: "2026-10-16",
  requiredGesture: TODAY_GESTURE,
  gestureHint:
    "拍摄 5–15 秒连续视频：全身入镜 → 完成指定手势 → 报出当日口令数字。画面需包含当日指定物件。",
  checkedInToday: 412,
  pendingReviews: 128,
};

const REVIEW_SEEDS: Array<
  [name: string, campus: Campus["id"], day: number, approves: number, reports: number, status: ChallengeCheckin["status"]]
> = [
  ["梁子谦", "must", 7, 6, 0, "pending"],
  ["Sunny Lau", "hku", 7, 4, 1, "pending"],
  ["王沐辰", "xjtl", 7, 3, 0, "pending"],
  ["何雨泽", "must", 6, 9, 0, "approved"],
  ["Tina Wong", "unnc", 6, 8, 0, "approved"],
  ["赵铭", "cuhk", 6, 5, 2, "pending"],
  ["林楚", "um", 6, 7, 0, "approved"],
  ["Kevin Tsang", "hku", 5, 6, 1, "pending"],
];

export const PEER_REVIEW_QUEUE: ChallengeCheckin[] = REVIEW_SEEDS.map(
  (r, i) => ({
    id: `c-${String(i + 1).padStart(3, "0")}`,
    userId: `u-r${i + 1}`,
    displayName: r[0],
    campusId: r[1],
    day: r[2],
    date: "2026-10-16",
    requiredGesture: TODAY_GESTURE,
    masked: true,
    status: r[5],
    approves: r[3],
    reports: r[4],
    submittedAt: "2026-10-16T08:12:00+08:00",
    offlineProofRequired: i < 2,
  }),
);

export function findCampus(id: Campus["id"]): Campus {
  const hit = CAMPUSES.find((c) => c.id === id);
  if (!hit) throw new Error(`未知高校战队：${id}`);
  return hit;
}
