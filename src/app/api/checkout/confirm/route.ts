import { NextResponse } from "next/server";
import { GATEWAY_LABEL, PRODUCT_LABEL } from "@/lib/constants";
import { confirmOrder, getOrder, orderLineItems } from "@/lib/data/orders";

/**
 * 模拟支付回调：把订单置为已支付。
 * 真实对接时，这段逻辑应由支付网关的异步回调（验签后）触发。
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { orderId?: string }
    | null;

  if (!body?.orderId) {
    return NextResponse.json({ error: "缺少 orderId" }, { status: 400 });
  }

  const order = confirmOrder(body.orderId) ?? getOrder(body.orderId);
  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }

  return NextResponse.json({
    ...order,
    productLabel: PRODUCT_LABEL[order.sku],
    gatewayLabel: GATEWAY_LABEL[order.gateway],
    lineItems: orderLineItems(order),
  });
}
