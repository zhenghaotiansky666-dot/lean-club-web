import { NextResponse } from "next/server";
import { voteOnCheckin } from "@/lib/data/mutations";
import { REPORT_REASONS } from "@/lib/constants";
import type { ReportReason } from "@/lib/types";

/** 全民监督投票：通过 / 举报 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        checkinId?: string;
        reviewerId?: string;
        verdict?: "approve" | "report";
        reasons?: ReportReason[];
      }
    | null;

  if (!body?.checkinId || !body.verdict) {
    return NextResponse.json(
      { error: "缺少 checkinId 或 verdict" },
      { status: 400 },
    );
  }
  if (body.verdict === "report") {
    const valid = (body.reasons ?? []).filter((r) =>
      REPORT_REASONS.includes(r),
    );
    if (valid.length === 0) {
      return NextResponse.json(
        { error: "举报需至少选择一项疑点" },
        { status: 422 },
      );
    }
    body.reasons = valid;
  }

  const vote = await voteOnCheckin({
    checkinId: body.checkinId,
    reviewerId: body.reviewerId ?? "u-self",
    verdict: body.verdict,
    reasons: body.reasons,
  });

  return NextResponse.json({ vote }, { status: 201 });
}
