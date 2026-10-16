import { DEPOSIT_CENTS, REVENUE_SPLIT, TICKET_PRICE_CENTS } from "./constants";
import type {
  ChallengeCheckin,
  PaymentGateway,
  PaymentOrder,
  PeerReviewVote,
  ProductSku,
  ReportReason,
} from "./types";

/**
 * 客户端写入通道。
 *
 * - 常规运行（Node / Vercel）：调用 /api/* Route Handler。
 * - 静态演示（GitHub Pages，NEXT_PUBLIC_STATIC_DEMO=1）：没有服务端，
 *   在浏览器内生成与 API 完全同形状的对象，保证交互与 UI 一致。
 */
const STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

const SKU_AMOUNT: Record<ProductSku, number> = {
  leaderboard_ticket_9_9: TICKET_PRICE_CENTS,
  challenge_deposit_100: DEPOSIT_CENTS,
};

function shortId(prefix: string): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 4096)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `${prefix}-${stamp}-${rand}`;
}

async function postJson<T>(url: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function createOrder(input: {
  sku: ProductSku;
  gateway: PaymentGateway;
  userId: string;
}): Promise<PaymentOrder> {
  if (!STATIC_DEMO) {
    const order = await postJson<PaymentOrder>("/api/checkout", input);
    if (order) return order;
  }
  return {
    orderId: shortId("LC"),
    userId: input.userId,
    sku: input.sku,
    amountCents: SKU_AMOUNT[input.sku],
    currency: "CNY",
    gateway: input.gateway,
    status: "created",
    split: { ...REVENUE_SPLIT },
    createdAt: new Date().toISOString(),
  };
}

export async function confirmOrder(order: PaymentOrder): Promise<PaymentOrder> {
  if (!STATIC_DEMO) {
    const paid = await postJson<PaymentOrder>("/api/checkout/confirm", {
      orderId: order.orderId,
    });
    if (paid) return paid;
  }
  return { ...order, status: "paid", paidAt: new Date().toISOString() };
}

export async function submitCheckin(input: {
  userId: string;
  day: number;
  gesture: string;
}): Promise<ChallengeCheckin> {
  if (!STATIC_DEMO) {
    const res = await postJson<{ checkin: ChallengeCheckin }>(
      "/api/checkins",
      input,
    );
    if (res?.checkin) return res.checkin;
  }
  return {
    id: shortId("C"),
    userId: input.userId,
    displayName: "你",
    campusId: "must",
    day: input.day,
    date: new Date().toISOString(),
    requiredGesture: input.gesture,
    masked: true,
    status: "pending",
    approves: 0,
    reports: 0,
    submittedAt: new Date().toISOString(),
  };
}

export async function voteCheckin(input: {
  checkinId: string;
  reviewerId: string;
  verdict: "approve" | "report";
  reasons?: ReportReason[];
}): Promise<PeerReviewVote> {
  if (!STATIC_DEMO) {
    const res = await postJson<{ vote: PeerReviewVote }>(
      "/api/checkins/vote",
      input,
    );
    if (res?.vote) return res.vote;
  }
  return {
    id: shortId("V"),
    checkinId: input.checkinId,
    reviewerId: input.reviewerId,
    verdict: input.verdict,
    reasons: input.reasons,
    createdAt: new Date().toISOString(),
  };
}
