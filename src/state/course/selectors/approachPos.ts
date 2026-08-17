import { CourseState } from "../courseState";
import { selectCurrentHole } from "./currentHole";
import { selectCurrentPinFromHole } from "./currentPin";
import { selectCurrentTeeFromHole } from "./currentTee";
import { Hole } from "model/Hole";
import { LatLng } from "model/LatLng";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";

/** A waypoint on top of the pin says nothing about the line into the green. */
const MIN_WAYPOINT_DISTANCE = 1;

export const selectApproachPos = (courseState: CourseState) =>
  selectApproachPosFromHole(selectCurrentHole(courseState));

/**
 * Where the green is played from — the last waypoint before it, which on a
 * dogleg is the apex. Holes with no waypoints are approached from their tee.
 *
 * Unlike the ball, this does not move while the hole is played, so a view lined
 * up on it holds still as the player walks around the green.
 */
export const selectApproachPosFromHole = (
  hole: Pick<
    Hole,
    "pinPlayed" | "pins" | "teePlayed" | "tees" | "waypoints"
  > | null
): LatLng | null => {
  if (!hole) return null;

  const pinPos = selectCurrentPinFromHole(hole);
  const teePos = selectCurrentTeeFromHole(hole)?.pos ?? null;
  if (!pinPos) return teePos;

  const waypoints = (hole.waypoints || []).flatMap((waypoint) =>
    waypoint.lat !== undefined && waypoint.lng !== undefined
      ? [{ lat: waypoint.lat, lng: waypoint.lng, alt: waypoint.alt ?? null }]
      : []
  );

  const nearest = waypoints.reduce<{ pos: LatLng; distance: number } | null>(
    (closest, pos) => {
      const distance = calculateDistanceBetweenPositions(pos, pinPos);
      if (distance < MIN_WAYPOINT_DISTANCE) return closest;
      return !closest || distance < closest.distance
        ? { pos, distance }
        : closest;
    },
    null
  );

  return nearest?.pos ?? teePos;
};
