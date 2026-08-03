import { Hole } from "model/Hole";
import { Stroke } from "model/Stroke";

export function countPenaltyStrokes(strokes: Stroke[]): number {
  return strokes.reduce((total, stroke) => total + (stroke.penalty?.strokes ?? 0), 0);
}

// Score is swings plus penalty strokes. strokes.length alone is the swing count,
// which is what the club and distance stats want, so score has to be derived.
export function calculateHoleScore(hole: Hole): number {
  return hole.strokes.length + countPenaltyStrokes(hole.strokes);
}

// The number a player would call a swing: its index shifted by the penalties
// already on the card when they played it. Penalties on the swing itself are
// incurred by it, so they push the *next* swing's number, not this one's —
// scrolling back through a hole shows each shot the number it had at the time.
export function strokeNumberWithPenalties(
  strokes: Stroke[],
  strokeNum: number
): number {
  return (
    strokeNum + countPenaltyStrokes(strokes.slice(0, Math.max(0, strokeNum - 1)))
  );
}
