import { lonToMeters } from "interfaceAdaptorsLayer/presenters/utils/metersToLongitude";
import { Hole } from "model/Hole";
import { Stroke } from "model/Stroke";
import { calculateDistanceBetweenPositions } from "interfaceAdaptorsLayer/usecaseLayer/usecases/hole/calculateDistanceBetweenPositions";

export function calculateStrokeDistances(hole: Hole, strokes: Stroke[]) {
  return strokes.map((stroke, i) => {
    if (!!stroke.ballPos && i < strokes.length - 1) {
      const nextStrokePos = strokes[i + 1]?.ballPos;
      if (nextStrokePos) {
        const strokeDistance = calculateDistanceBetweenPositions(
          stroke.ballPos,
          nextStrokePos
        );
        return {
          ...stroke,
          strokeDistance,
        };
      }
    }
    return {
      ...stroke,
      strokeDistance: undefined,
    };
  });
}
