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
    const fromPos =
      stroke.fromPos || (i > 0 ? strokes[i - 1]?.toPos : undefined); // || hole.teePos[tee]
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
