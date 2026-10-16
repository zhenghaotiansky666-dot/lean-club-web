import type { ChallengeCheckin, PeerReviewVote, ReportReason } from "../types";

/**
 * 写入操作（打卡提交 / 全民监督投票）。
 * mock 环境直接返回构造好的对象；对接 Supabase 时在此写入表并回读。
 * 仅供 Route Handler 调用，客户端请走 /api/checkins 系列接口。
 */

const wait = (ms = 0) => new Promise((r) => setTimeout(r, ms));

export async function createCheckin(input: {
  userId: string;
  day: number;
  gesture: string;
}): Promise<ChallengeCheckin> {
  await wait();
  return {
    id: `c-new-${Date.now().toString(36)}`,
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

export async function voteOnCheckin(input: {
  checkinId: string;
  reviewerId: string;
  verdict: "approve" | "report";
  reasons?: ReportReason[];
}): Promise<PeerReviewVote> {
  await wait();
  return {
    id: `v-${Date.now().toString(36)}`,
    checkinId: input.checkinId,
    reviewerId: input.reviewerId,
    verdict: input.verdict,
    reasons: input.reasons,
    createdAt: new Date().toISOString(),
  };
}
