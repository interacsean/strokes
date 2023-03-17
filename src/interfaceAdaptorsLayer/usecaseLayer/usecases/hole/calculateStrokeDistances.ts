import { lonToMeters } from "interfaceAdaptorsLayer/presenters/utils/metersToLongitude";
import { Hole } from "model/Hole";
import { Stroke } from "model/Stroke";

export function calculateStrokeDistances(hole: Hole, strokes: Stroke[]) {
  return strokes.map((stroke, i) => {
    if (!!stroke.ballPos && i < strokes.length - 1) {
      const nextStrokePos = strokes[i + 1]?.ballPos;
      if (nextStrokePos) {
        const deltaX = lonToMeters(nextStrokePos.lng - stroke.ballPos.lng, stroke.ballPos.lat);
        const deltaY = (nextStrokePos.lat - stroke.ballPos.lat) * 111320;
        const strokeDistance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

        return {
          ...stroke,
          strokeDistance,
        }
      }
    }
    return {
      ...stroke,
      strokeDistance: undefined,
    }
  })
}