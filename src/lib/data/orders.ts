import { PRODUCT_LABEL, REVENUE_SPLIT, TICKET_PRICE_CENTS, DEPOSIT_CENTS } from "../constants";
import type { PaymentGateway, PaymentOrder, ProductSku } from "../types";

/**
 * 订单存储：mock 环境使用进程内 Map（重启即清空）。
 * 对接真实聚合支付时，把这里替换为数据库读写即可，接口签名保持不变。
 */
const ORDERS = new Map<string, PaymentOrder>();

const SKU_AMOUNT: Record<ProductSku, number> = {
  leaderboard_ticket_9_9: TICKET_PRICE_CENTS,
  challenge_deposit_100: DEPOSIT_CENTS,
};

function makeOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 4096)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `LC-${stamp}-${rand}`;
}

export function createOrder(input: {
  userId: string;
  sku: ProductSku;
  gateway: PaymentGateway;
}): PaymentOrder {
  const order: PaymentOrder = {
    orderId: makeOrderId(),
    userId: input.userId,
    sku: input.sku,
    amountCents: SKU_AMOUNT[input.sku],
    currency: "CNY",
    gateway: input.gateway,
    status: "created",
    split: { ...REVENUE_SPLIT },
    createdAt: new Date().toISOString(),
  };
  ORDERS.set(order.orderId, order);
  // 真实环境：POST {gateway}/unifiedorder → 返回 prepay_id / code_url
  // 分润：amountCents * split.ip / split.platform / split.chapterFund
  return order;
}

export function confirmOrder(orderId: string): PaymentOrder | null {
  const order = ORDERS.get(orderId);
  if (!order) return null;

  const paid: PaymentOrder = {
    ...order,
    status: "paid",
    paidAt: new Date().toISOString(),
  };
  ORDERS.set(orderId, paid);
  return paid;
}

export function getOrder(orderId: string): PaymentOrder | null {
  return ORDERS.get(orderId) ?? null;
}

export function listOrders(): PaymentOrder[] {
  return [...ORDERS.values()].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );
}

export function orderLineItems(order: PaymentOrder) {
  return {
    label: PRODUCT_LABEL[order.sku],
    amountCents: order.amountCents,
    split: order.split,
  };
}
