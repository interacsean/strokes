import { Hole } from "model/Hole";
import { Stroke } from "model/Stroke";
import { selectCurrentPinFromHole } from "state/course/selectors/currentPin";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";

export function calculateStrokeDistances(hole: Hole, strokes: Stroke[]) {
  return strokes.map((stroke, i) => {
    const pin = selectCurrentPinFromHole(hole);
    const distanceToHole =
      pin && stroke.fromPos
        ? calculateDistanceBetweenPositions(
            stroke.fromPos,
            stroke.intendedPos || pin
          )
        : undefined;
    // Falling back to where the previous stroke finished is only valid if the
    // ball was played on from there — after relief it was moved or replayed.
    const prevStroke = i > 0 ? strokes[i - 1] : undefined;
    const fromPos =
      stroke.fromPos ||
      (prevStroke && !prevStroke.penalty?.relief
        ? prevStroke.toPos
        : undefined); // || hole.teePos[tee]
    const toPos = stroke.toPos;
    if (!fromPos || !toPos) {
      return {
        ...stroke,
        strokeDistance: undefined,
        distanceToHole,
      };
    }
    const strokeDistance = calculateDistanceBetweenPositions(fromPos, toPos);
    return {
      ...stroke,
      strokeDistance,
      distanceToHole,
    };
  });
}
