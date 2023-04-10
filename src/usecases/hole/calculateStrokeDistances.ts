import { Hole } from "model/Hole";
import { Stroke } from "model/Stroke";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";

export function calculateStrokeDistances(hole: Hole, strokes: Stroke[]) {
  return strokes.map((stroke, i) => {
    const distanceToHole =
      hole.holePos && stroke.liePos
        ? calculateDistanceBetweenPositions(
            stroke.liePos,
            stroke.intendedPos || hole.holePos
          )
        : undefined;
    const fromPos =
      stroke.liePos || (i > 0 ? strokes[i - 1]?.strokePos : undefined); // || hole.teePos[tee]
    const toPos = stroke.strokePos;
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
