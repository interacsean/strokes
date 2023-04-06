import { LatLng } from "model/LatLng";
import { lonToMeters } from "interfaceAdaptorsLayer/presenters/utils/metersToLongitude";

export function calculateDistanceBetweenPositions(pos: LatLng, pos2: LatLng) {
  const deltaX = lonToMeters(pos2.lng - pos.lng, pos.lat);
  const deltaY = (pos2.lat - pos.lat) * 111320;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
