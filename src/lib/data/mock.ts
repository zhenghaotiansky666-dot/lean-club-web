import { SELF_ENTRY_SEED, CAMPUSES, DAILY_CHALLENGE, LEADERBOARD, PEER_REVIEW_QUEUE } from "../mock-data";
import type {
  CampusStanding,
  ChallengeCheckin,
  DailyChallenge,
  LeaderboardEntry,
} from "../types";

const wait = (ms = 0) => new Promise((r) => setTimeout(r, ms));

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  "use cache";
  await wait();
  return LEADERBOARD.map((e) => ({ ...e }));
}

export async function getSelfEntry(): Promise<LeaderboardEntry> {
  "use cache";
  await wait();
  return {
    rank: 0,
    userId: "u-self",
    displayName: "你",
    campusId: "must",
    isSelf: true,
    ...SELF_ENTRY_SEED,
  };
}

export async function getCampusBoard(): Promise<CampusStanding[]> {
  "use cache";
  await wait();
  const standings: CampusStanding[] = CAMPUSES.map((campus) => {
    const rows = LEADERBOARD.filter((e) => e.campusId === campus.id);
    const avg =
      rows.length === 0
        ? 0
        : Math.round(rows.reduce((s, r) => s + r.leanIndex, 0) / rows.length);
    return {
      rank: 0,
      campus,
      activeMembers: campus.memberCount,
      checkins: campus.checkinCount,
      avgLeanIndex: avg,
      isTopCampus: false,
    };
  });

  standings.sort((a, b) => b.checkins - a.checkins);
  standings.forEach((s, i) => {
    s.rank = i + 1;
    s.isTopCampus = i === 0;
  });
  return standings;
}

export async function getTodayChallenge(): Promise<DailyChallenge> {
  "use cache";
  await wait();
  return { ...DAILY_CHALLENGE };
}

export async function getPeerReviewQueue(): Promise<ChallengeCheckin[]> {
  "use cache";
  await wait();
  return PEER_REVIEW_QUEUE.map((c) => ({ ...c }));
}
