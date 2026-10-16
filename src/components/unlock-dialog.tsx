"use client";

import { useState } from "react";
import { Check, Loader2, ShieldCheck, Wallet } from "lucide-react";
import { copy } from "@/lib/copy";
import {
  DEPOSIT_CENTS,
  GATEWAY_LABEL,
  REVENUE_SPLIT,
  TICKET_PRICE_CENTS,
} from "@/lib/constants";
import { formatCents } from "@/lib/format";
import { confirmOrder, createOrder } from "@/lib/client-api";
import type { PaymentGateway, PaymentOrder, ProductSku } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const GATEWAYS: PaymentGateway[] = ["yunshanfu", "wechat", "alipay"];

export function UnlockDialog({
  open,
  onOpenChange,
  sku = "leaderboard_ticket_9_9",
  onPaid,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sku?: ProductSku;
  onPaid: (order: PaymentOrder) => void;
}) {
  const [gateway, setGateway] = useState<PaymentGateway>("wechat");
  const [phase, setPhase] = useState<"idle" | "creating" | "paid" | "error">(
    "idle",
  );
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const amount = sku === "challenge_deposit_100" ? DEPOSIT_CENTS : TICKET_PRICE_CENTS;

  async function pay() {
    setPhase("creating");
    setError(null);
    try {
      const created = await createOrder({ sku, gateway, userId: "u-self" });
      const confirmed = await confirmOrder(created);

      setOrder(confirmed);
      setPhase("paid");
      onPaid(confirmed);
    } catch {
      setPhase("error");
      setError("创建订单失败，请稍后重试（MVP 为模拟环境）");
    }
  }

  function reset(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setTimeout(() => {
        setPhase("idle");
        setOrder(null);
        setError(null);
      }, 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogContent className="border border-[#242424] bg-[#0d0d0d] sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md border border-[#00ff66]/40 bg-[#00ff66]/10">
              <Wallet className="size-4 text-[#00ff66]" />
            </span>
            <DialogTitle className="text-[15px] tracking-[0.04em] text-white">
              {phase === "paid" ? copy.unlock.paidTitle : copy.unlock.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-[13px] leading-relaxed text-white/50">
            {phase === "paid" ? copy.unlock.paidBody : copy.unlock.body}
          </DialogDescription>
        </DialogHeader>

        {phase === "paid" && order ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#00ff66]/35 bg-[#00ff66]/[0.07] px-3 py-2.5">
              <Check className="size-4 text-[#00ff66]" />
              <span className="text-[12px] text-[#b9ffd4]">
                数字 Pass 已下发 · {order.sku === "challenge_deposit_100" ? "押金订单" : "门票订单"}
              </span>
            </div>
            <dl className="grid gap-1.5 rounded-xl border border-[#1f1f1f] bg-black/60 p-3 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-white/40">{copy.unlock.orderId}</dt>
                <dd className="lc-num text-white/80">{order.orderId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/40">支付通道</dt>
                <dd className="text-white/80">{GATEWAY_LABEL[order.gateway]}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/40">金额</dt>
                <dd className="lc-num text-white/80">
                  {formatCents(order.amountCents)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/40">分润 40/40/20</dt>
                <dd className="lc-num text-white/80">
                  {formatCents((order.amountCents * REVENUE_SPLIT.ip) / 100)} ·{" "}
                  {formatCents((order.amountCents * REVENUE_SPLIT.platform) / 100)} ·{" "}
                  {formatCents((order.amountCents * REVENUE_SPLIT.chapterFund) / 100)}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-2">
              {copy.unlock.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-[13px] text-white/70">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-[#00ff66]" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="flex items-end justify-between rounded-xl border border-[#1f1f1f] bg-black/60 px-3 py-3">
              <div>
                <p className="lc-label">{copy.unlock.priceLabel}</p>
                <p className="lc-num mt-1 text-2xl font-semibold text-white">
                  {formatCents(amount)}
                </p>
              </div>
              <p className="max-w-[190px] text-right text-[11px] leading-relaxed text-white/35">
                {copy.unlock.gatewayHint}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {GATEWAYS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGateway(g)}
                  aria-pressed={gateway === g}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] transition-colors",
                    gateway === g
                      ? "border-[#00ff66]/50 bg-[#00ff66]/10 text-[#00ff66]"
                      : "border-[#242424] bg-[#141414] text-white/60 hover:text-white",
                  )}
                >
                  <Wallet className="size-3.5" />
                  {GATEWAY_LABEL[g]}
                </button>
              ))}
            </div>

            {error ? (
              <p className="text-[12px] text-[#ff6b6b]">{error}</p>
            ) : null}
          </div>
        )}

        <DialogFooter className="gap-2 border-t border-[#1c1c1c] pt-4">
          {phase === "paid" ? (
            <Button
              className="w-full bg-[#00ff66] text-black hover:bg-[#4dffa0]"
              onClick={() => reset(false)}
            >
              {copy.unlock.close}
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-white/50 hover:text-white"
                onClick={() => reset(false)}
              >
                暂不加入
              </Button>
              <Button
                className="flex-1 bg-[#00ff66] font-semibold text-black hover:bg-[#4dffa0]"
                onClick={pay}
                disabled={phase === "creating"}
              >
                {phase === "creating" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {copy.unlock.paying}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-4" />
                    {copy.unlock.payCta}
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
