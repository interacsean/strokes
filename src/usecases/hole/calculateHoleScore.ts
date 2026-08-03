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
