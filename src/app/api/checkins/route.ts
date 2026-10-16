import { NextResponse } from "next/server";
import { createCheckin } from "@/lib/data/mutations";
import { CHALLENGE_DAYS } from "@/lib/constants";

/** 提交当日打卡（mock：不入库，仅回传构造结果） */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { userId?: string; day?: number; gesture?: string }
    | null;

  if (!body?.day || !body.gesture) {
    return NextResponse.json({ error: "缺少 day 或 gesture" }, { status: 400 });
  }
  if (body.day < 1 || body.day > CHALLENGE_DAYS) {
    return NextResponse.json(
      { error: `day 必须在 1–${CHALLENGE_DAYS} 之间` },
      { status: 400 },
    );
  }

  const checkin = await createCheckin({
    userId: body.userId ?? "u-self",
    day: body.day,
    gesture: body.gesture,
  });

  return NextResponse.json(
    { checkin, nextAction: { type: "peer_review", note: "等待全民监督审核" } },
    { status: 201 },
  );
}
