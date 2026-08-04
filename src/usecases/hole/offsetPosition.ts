import { LatLng } from "model/LatLng";
import { metersToLat, metersToLon } from "presenters/utils/metersToLongitude";

/**
 * The position `distance` metres away from `from`, along `bearing` degrees
 * clockwise from north. Altitude is not modelled, so it comes back unchanged.
 */
export function offsetPosition(
  from: LatLng,
  bearing: number,
  distance: number
): LatLng {
  const bearingRadians = (bearing * Math.PI) / 180;
  const north = distance * Math.cos(bearingRadians);
  const east = distance * Math.sin(bearingRadians);

  return {
    lat: from.lat + metersToLat(north),
    lng: from.lng + metersToLon(east, from.lat),
    alt: from.alt,
  };
}
