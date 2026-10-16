/**
 * Lean Club · 领域模型
 * 所有数据访问层与 UI 都共享这些类型；对接真实后端（Supabase）时保持不变。
 */

export type CampusId =
  | "must"
  | "hku"
  | "xjtl"
  | "unnc"
  | "cuhk"
  | "um";

/** 高校 / 城市战队 */
export interface Campus {
  id: CampusId;
  /** 简体校名，如「澳门科技大学」 */
  name: string;
  /** 英文名，如 Macau University of Science and Technology */
  nameEn: string;
  /** 战队列名，如 MUST / HKU */
  shortName: string;
  city: string;
  country: string;
  /** 战队总人数 */
  memberCount: number;
  /** 战队累计打卡次数 */
  checkinCount: number;
}

export type PassTier = "founder" | "gold" | "silver" | "bronze";

/** 数字 Pass 徽章 */
export interface DigitalPass {
  id: string;
  tier: PassTier;
  serial: string;
  issuedAt: string;
}

export interface User {
  id: string;
  /** 展示名（会出现在榜单上） */
  displayName: string;
  campusId: CampusId;
  city: string;
  joinedAt: string;
  pass?: DigitalPass;
  /** 是否为「本机用户」（解锁后注入榜单的虚拟席位） */
  isSelf?: boolean;
}

/** 排行榜个人席位 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  campusId: CampusId;
  /** 薄肌指数 0–100 */
  leanIndex: number;
  /** 累计打卡天数 */
  checkinDays: number;
  /** 当前连续打卡天数 */
  streak: number;
  passTier?: PassTier;
  isSelf?: boolean;
}

/** 高校战队的聚合排名 */
export interface CampusStanding {
  rank: number;
  campus: Campus;
  /** 已打卡人数 */
  activeMembers: number;
  /** 打卡总次数 */
  checkins: number;
  /** 平均薄肌指数 */
  avgLeanIndex: number;
  /** 是否为「#1 Lean Campus」认证 */
  isTopCampus: boolean;
}

export type CheckinStatus = "pending" | "approved" | "rejected";

/** 21 天挑战的单日打卡 */
export interface ChallengeCheckin {
  id: string;
  userId: string;
  displayName: string;
  campusId: CampusId;
  day: number;
  date: string;
  /** 当日系统动态口令 / 指定手势，如「比 ✌️ 手势」 */
  requiredGesture: string;
  /** 打卡媒体（mock 环境为空，UI 用 CSS 占位 + 自动打码遮罩） */
  mediaUrl?: string;
  /** 是否已完成隐私打码（脸与敏感区域） */
  masked: boolean;
  status: CheckinStatus;
  approves: number;
  reports: number;
  submittedAt: string;
  /** 距离总榜前 10% 提现验证还差多少名（mock 用于文案展示） */
  offlineProofRequired?: boolean;
}

export type ReportReason =
  | "ai_generated"
  | "lighting_unnatural"
  | "missing_gesture"
  | "reused_media"
  | "other";

/** 全民监督投票 */
export interface PeerReviewVote {
  id: string;
  checkinId: string;
  reviewerId: string;
  verdict: "approve" | "report";
  reasons?: ReportReason[];
  createdAt: string;
}

export type ProductSku = "leaderboard_ticket_9_9" | "challenge_deposit_100";
export type PaymentGateway = "yunshanfu" | "wechat" | "alipay";
export type OrderStatus =
  | "created"
  | "pending"
  | "paid"
  | "refunded"
  | "failed";

/** 订单（预留真实聚合支付通道） */
export interface PaymentOrder {
  orderId: string;
  userId: string;
  sku: ProductSku;
  /** 金额（分） */
  amountCents: number;
  currency: "CNY";
  gateway: PaymentGateway;
  status: OrderStatus;
  /** 分润拆分：40% IP / 40% 平台技术 / 20% 各地分会长活动基金 */
  split: RevenueSplit;
  createdAt: string;
  paidAt?: string;
  refundedAt?: string;
}

export interface RevenueSplit {
  /** 百分比 */
  ip: number;
  platform: number;
  chapterFund: number;
}

/** 当日挑战信息 */
export interface DailyChallenge {
  day: number;
  totalDays: number;
  date: string;
  /** 今日动态口令 */
  requiredGesture: string;
  /** 口令说明，用于审核标准 */
  gestureHint: string;
  /** 今日已打卡人数 */
  checkedInToday: number;
  /** 今日待审核的打卡数 */
  pendingReviews: number;
}
