import type { CampusId, PaymentGateway, ProductSku, RevenueSplit } from "./types";

/** 9.9 元排行榜门票（分） */
export const TICKET_PRICE_CENTS = 990;
/** 21 天挑战押金（分） */
export const DEPOSIT_CENTS = 10000;
/** 挑战天数 */
export const CHALLENGE_DAYS = 21;
/** 冲击总榜前 N%（需线下部长合照背书才能提现） */
export const TOP_PERCENT_FOR_OFFLINE_PROOF = 10;

/** 收益拆分：40% IP / 40% 平台技术 / 20% 各地高校分会长活动基金 */
export const REVENUE_SPLIT: RevenueSplit = {
  ip: 40,
  platform: 40,
  chapterFund: 20,
};

export const PRODUCT_LABEL: Record<ProductSku, string> = {
  leaderboard_ticket_9_9: "全球薄肌排行榜门票",
  challenge_deposit_100: "21 天自律执行力对赌押金",
};

export const GATEWAY_LABEL: Record<PaymentGateway, string> = {
  yunshanfu: "云闪付",
  wechat: "微信支付",
  alipay: "支付宝",
};

/** mock 环境的「本机用户」 */
export const SELF_USER_ID = "u-self";
export const SELF_CAMPUS_ID: CampusId = "must";
export const SELF_DISPLAY_NAME = "你";

/** 动态口令池：每日随机指定手势（真实环境由后端按日期下发） */
export const GESTURE_POOL = [
  "比 ✌️ 手势",
  "比 👍 手势",
  "单手握拳贴胸口",
  "手掌比出数字 2️⃣ 1️⃣",
  "双手比 ❤️",
  "比 6️⃣ 手势（拇指+小指）",
  "手掌向前张开五指",
  "手比 L 形",
] as const;

export const REPORT_REASON_LABEL = {
  ai_generated: "疑似 AI 生成 / 换脸痕迹",
  lighting_unnatural: "光影不自然，疑似翻拍或合成",
  missing_gesture: "视频中未出现当日指定手势 / 口令",
  reused_media: "疑似复用旧素材（与其他日期雷同）",
  other: "其他问题",
} as const;

export const REPORT_REASONS = Object.keys(
  REPORT_REASON_LABEL,
) as (keyof typeof REPORT_REASON_LABEL)[];

/** 本机解锁状态在 localStorage 的 key */
export const UNLOCK_STORAGE_KEY = "leanclub.unlock";
