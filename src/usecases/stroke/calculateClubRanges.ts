import { Club } from "model/Club";
import { ClubStats } from "model/ClubStats";
import { StrokeType } from "model/StrokeType";

/** Low and high are the 1 SD bounds; mid is the median. */
export type ClubRange = {
  low: number;
  mid: number;
  high: number;
};

export type ClubRanges = {
  carry: ClubRange;
  total: ClubRange;
};

/**
 * Club stats record where the ball comes to rest, which is what the caddie
 * matches against distance-to-target, so those distances are totals and `roll`
 * is what separates them from carry. Where a club has no roll recorded we fall
 * back to assuming the ball runs on this far.
 */
const ASSUMED_ROLL_M = 10;

const isUsableRange = ({ low, mid, high }: ClubRange) =>
  low > 0 && mid > 0 && high > 0;

/**
 * Carry and total distance bands for a club played with a given stroke type,
 * or null when we have nothing useful to draw (unknown club, no stats for that
 * stroke type, or a stroke with no meaningful range such as a putt).
 */
export function calculateClubRanges(
  clubStats: ClubStats,
  club: Club | undefined,
  strokeType: StrokeType | undefined
): ClubRanges | null {
  if (!club || !strokeType) return null;

  const stats = clubStats[club]?.[strokeType];
  if (!stats) return null;

  const total: ClubRange = {
    low: stats.sd1Distances[0],
    mid: stats.medianDistance,
    high: stats.sd1Distances[1],
  };
  const roll = stats.roll || ASSUMED_ROLL_M;
  const carry: ClubRange = {
    low: total.low - roll,
    mid: total.mid - roll,
    high: total.high - roll,
  };

  if (!isUsableRange(total) || !isUsableRange(carry)) return null;

  return { carry, total };
}
