import { LatLng } from "model/LatLng";

/** Altitude is left out: two readings of the same spot on the ground routinely
 * differ in altitude alone. */
export function samePosition(
  a: LatLng | null | undefined,
  b: LatLng | null | undefined
): boolean {
  return !!a && !!b && a.lat === b.lat && a.lng === b.lng;
}
