import { NextResponse } from "next/server";
import { GATEWAY_LABEL, PRODUCT_LABEL } from "@/lib/constants";
import { createOrder, listOrders } from "@/lib/data/orders";
import type { PaymentGateway, ProductSku } from "@/lib/types";

const SKUS: ProductSku[] = [
  "leaderboard_ticket_9_9",
  "challenge_deposit_100",
];
const GATEWAYS: PaymentGateway[] = ["yunshanfu", "wechat", "alipay"];

/**
 * 创建订单（模拟聚合支付）。
 * 真实对接时：在此调用云闪付 / 微信 / 支付宝的统一下单接口，
 * 用返回的 prepay_id / code_url 唤起收银台，并依据 REVENUE_SPLIT
 *（40% IP · 40% 平台技术 · 20% 各地分会长基金）生成分账计划。
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { sku?: ProductSku; gateway?: PaymentGateway; userId?: string }
    | null;

  if (!body?.sku || !SKUS.includes(body.sku)) {
    return NextResponse.json(
      {
        error:
          "无效的 sku，应为 leaderboard_ticket_9_9 或 challenge_deposit_100",
      },
      { status: 400 },
    );
  }

  const gateway: PaymentGateway =
    body.gateway && GATEWAYS.includes(body.gateway) ? body.gateway : "wechat";

  const order = createOrder({
    userId: body.userId ?? "u-self",
    sku: body.sku,
    gateway,
  });

  return NextResponse.json(
    {
      ...order,
      productLabel: PRODUCT_LABEL[order.sku],
      gatewayLabel: GATEWAY_LABEL[order.gateway],
      nextAction: {
        type: "confirm",
        endpoint: "/api/checkout/confirm",
        payload: { orderId: order.orderId },
      },
    },
    { status: 201 },
  );
}

export async function GET() {
  return NextResponse.json({ orders: listOrders() });
}
