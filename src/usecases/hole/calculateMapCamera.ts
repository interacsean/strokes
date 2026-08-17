import { LatLng } from "model/LatLng";
import {
  latToMeters,
  lonToMeters,
  metersToLat,
  metersToLon,
} from "presenters/utils/metersToLongitude";

/** Room left around the framed points so nothing sits on the edge. */
const BUFFER_FACTOR = 1.05;

export type MapCamera = {
  center: LatLng;
  /** Fractional Google Maps zoom level. */
  zoom: number;
  /** Degrees clockwise from north, in the range [0, 360). */
  heading: number;
};

/** A point to keep in view, on its own or with ground kept clear around it so
 * that whatever marks it isn't left sitting on the edge of the map. */
export type FramedPoint = LatLng | { pos: LatLng; radius: number };

const positionOf = (point: FramedPoint) => ("pos" in point ? point.pos : point);
const radiusOf = (point: FramedPoint) => ("pos" in point ? point.radius : 0);

export type MapCameraInput = {
  /** Everything that has to stay in view. Nullish entries are ignored, so the
   * caller can pass points the course data may not define. */
  points: (FramedPoint | null | undefined)[];
  /** The direction the hole is played in, degrees clockwise from north. */
  holeBearing: number;
  /** Whether the hole lies across the map or runs up it. */
  orientation: "horizontal" | "vertical";
  /** Metres of ground the map spans at zoom 0, along the hole and across it.
   * Their ratio is the shape of the map element on screen. */
  alongHoleMapSize: number;
  acrossHoleMapSize: number;
  /** The view never zooms in past this much ground across the hole. */
  minAcrossHoleSpan: number;
  /** Google Maps tilt, in degrees. */
  tilt: number;
};

/**
 * Where to put the camera so that every point is in view, with the hole lying
 * the way the map wants it.
 *
 * Framing two points on the hole's line — the ball and the pin, say — puts them
 * at either end of the view. Points off that line, like a ball missed left of
 * the green, widen the view to take them in.
 */
export function calculateMapCamera({
  points,
  holeBearing,
  orientation,
  alongHoleMapSize,
  acrossHoleMapSize,
  minAcrossHoleSpan,
  tilt,
}: MapCameraInput): MapCamera | null {
  const framed = points.filter((point): point is FramedPoint => !!point);
  const origin = framed[0] && positionOf(framed[0]);
  if (!origin) return null;

  const bearingRadians = (holeBearing * Math.PI) / 180;
  const cosBearing = Math.cos(bearingRadians);
  const sinBearing = Math.sin(bearingRadians);

  // Metres from the first point, along the hole and across it
  const offsets = framed.map((point) => {
    const pos = positionOf(point);
    const north = latToMeters(pos.lat - origin.lat);
    const east = lonToMeters(pos.lng - origin.lng, origin.lat);
    return {
      along: north * cosBearing + east * sinBearing,
      across: east * cosBearing - north * sinBearing,
      radius: radiusOf(point),
    };
  });

  // Each point takes up the ground kept clear around it, not just its own spot
  const alongMin = Math.min(...offsets.map((o) => o.along - o.radius));
  const alongMax = Math.max(...offsets.map((o) => o.along + o.radius));
  const acrossMin = Math.min(...offsets.map((o) => o.across - o.radius));
  const acrossMax = Math.max(...offsets.map((o) => o.across + o.radius));
  const alongSpan = alongMax - alongMin;
  const acrossSpan = acrossMax - acrossMin;

  // Points all on one line leave the other side of the view unconstrained.
  const zoomToFit = (mapSize: number, span: number) =>
    span > 0 ? Math.log2(mapSize / (span * BUFFER_FACTOR)) : Infinity;

  const zoom = Math.min(
    zoomToFit(alongHoleMapSize, alongSpan),
    zoomToFit(acrossHoleMapSize, acrossSpan),
    zoomToFit(acrossHoleMapSize, minAcrossHoleSpan / BUFFER_FACTOR)
  );

  // A tilted camera sees further up the hole than back down it, so it sits back
  // from the middle of what it is framing by a share of that ground.
  const setBack = (Math.sin((tilt * Math.PI) / 180) / 6) * alongSpan;
  const centerAlong = (alongMin + alongMax) / 2 - setBack;
  const centerAcross = (acrossMin + acrossMax) / 2;

  const north = centerAlong * cosBearing - centerAcross * sinBearing;
  const east = centerAlong * sinBearing + centerAcross * cosBearing;

  const heading = holeBearing + (orientation === "horizontal" ? -90 : 0);

  return {
    center: {
      lat: origin.lat + metersToLat(north),
      lng: origin.lng + metersToLon(east, origin.lat),
      alt: null,
    },
    zoom,
    heading: ((heading % 360) + 360) % 360,
  };
}
