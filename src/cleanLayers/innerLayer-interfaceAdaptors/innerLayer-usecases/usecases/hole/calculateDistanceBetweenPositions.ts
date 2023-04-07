import { LatLng } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/LatLng";
import { lonToMeters } from "cleanLayers/innerLayer-interfaceAdaptors/presenters/utils/metersToLongitude";

export function calculateDistanceBetweenPositions(pos: LatLng, pos2: LatLng) {
  const deltaX = lonToMeters(pos2.lng - pos.lng, pos.lat);
  const deltaY = (pos2.lat - pos.lat) * 111320;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
