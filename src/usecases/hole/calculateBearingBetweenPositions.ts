import { LatLng } from "model/LatLng";
import { latToMeters, lonToMeters } from "presenters/utils/metersToLongitude";

/**
 * Degrees clockwise from north, in the range (-180, 180]. Uses the same flat
 * approximation as calculateDistanceBetweenPositions, so bearings and distances
 * always agree with each other over the length of a golf hole.
 */
export function calculateBearingBetweenPositions(from: LatLng, to: LatLng) {
  const east = lonToMeters(to.lng - from.lng, from.lat);
  const north = latToMeters(to.lat - from.lat);
  return (Math.atan2(east, north) * 180) / Math.PI;
}
