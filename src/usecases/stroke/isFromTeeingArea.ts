import { PosOptionMethods } from "model/PosOptions";
import { Stroke } from "model/Stroke";

// Tee lies are only legal from the teeing area: the tee shot itself, or a
// stroke-and-distance replay of it (Rule 18.2 lets you tee the ball again).
// Only stroke 1 is played from the tee, so replaying it is always stroke 2.
export function isFromTeeingArea(
  strokeNum: number,
  stroke: Stroke | undefined
): boolean {
  if (strokeNum === 1) return true;
  return (
    strokeNum === 2 && stroke?.fromPosSetMethod === PosOptionMethods.REPLAY
  );
}
