import { Lie } from "model/Lie";
import { PenaltyReason } from "model/Penalty";

// Reasons a To lie can imply, and so the only ones cleared again when the lie
// changes back to somewhere playable. Manually added penalties (grounded club,
// moved ball) survive lie edits.
export const LieDerivedReasons = [
  PenaltyReason.PENALTY_AREA,
  PenaltyReason.OUT_OF_BOUNDS,
  PenaltyReason.LOST_BALL,
  PenaltyReason.UNPLAYABLE,
];

export function penaltyReasonForLie(
  lie: Lie | undefined | null
): PenaltyReason | undefined {
  switch (lie) {
    case Lie.WATER:
      return PenaltyReason.PENALTY_AREA;
    // Lie.HAZARD covers scrub and out of bounds alike; unplayable is the less
    // punitive read, and the reason is one tap to change.
    case Lie.HAZARD:
      return PenaltyReason.UNPLAYABLE;
    default:
      return undefined;
  }
}
