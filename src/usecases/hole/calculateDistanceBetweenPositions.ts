import { LatLng } from "model/LatLng";
import { latToMeters, lonToMeters } from "presenters/utils/metersToLongitude";

export function calculateDistanceBetweenPositions(pos: LatLng, pos2: LatLng) {
  const deltaX = lonToMeters(pos2.lng - pos.lng, pos.lat);
  const deltaY = latToMeters(pos2.lat - pos.lat);
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
