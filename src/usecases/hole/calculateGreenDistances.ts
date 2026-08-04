import { Hole } from "model/Hole";
import { LatLng } from "model/LatLng";
import { selectCurrentPinFromHole } from "state/course/selectors/currentPin";
import { calculateDistanceBetweenPositions } from "./calculateDistanceBetweenPositions";

/** Front of the green, the pin (centre), and back of the green. */
export type GreenPointKey = "front" | "pin" | "back";

export type GreenDistance = {
  key: GreenPointKey;
  pos: LatLng;
  /** Metres from the measuring position. */
  distance: number;
};

/**
 * Distances to the front, pin and back of the green, front first. Points the
 * course data doesn't define are left out rather than guessed at.
 */
export function calculateGreenDistances(
  hole: Hole,
  measureFrom: LatLng | null | undefined
): GreenDistance[] {
  if (!measureFrom) return [];

  const points: { key: GreenPointKey; pos: LatLng | null | undefined }[] = [
    { key: "front", pos: hole.green?.front },
    { key: "pin", pos: selectCurrentPinFromHole(hole) },
    { key: "back", pos: hole.green?.back },
  ];

  return points.flatMap(({ key, pos }) =>
    pos
      ? [
          {
            key,
            pos,
            distance: calculateDistanceBetweenPositions(measureFrom, pos),
          },
        ]
      : []
  );
}
