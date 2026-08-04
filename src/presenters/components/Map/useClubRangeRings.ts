/// <reference types="@types/google.maps" />

import { useEffect, useRef } from "react";
import { LatLng } from "model/LatLng";
import { ClubRanges } from "usecases/stroke/calculateClubRanges";
import { offsetPosition } from "usecases/hole/offsetPosition";

const CARRY_COLOR = "#ffff00";
const TOTAL_COLOR = "#00ffff";
/** The median is the one to read at a glance; the bounds sit back from it. */
const MID_OPACITY = 1;
const BOUND_OPACITY = 0.5;
/** Under the markers, above the imagery. */
const RING_Z_INDEX = 1;

/** Opens towards the target; less than a half circle so the ends don't wrap
 * back around and read as pointing away from the shot. */
const ARC_SWEEP_DEGREES = 120;
const ARC_STEPS = 32;

type Ring = {
  radius: number;
  color: string;
  opacity: number;
};

function toRings(ranges: ClubRanges | null): Ring[] {
  if (!ranges) return [];

  return [
    { radius: ranges.carry.low, color: CARRY_COLOR, opacity: BOUND_OPACITY },
    { radius: ranges.carry.mid, color: CARRY_COLOR, opacity: MID_OPACITY },
    { radius: ranges.carry.high, color: CARRY_COLOR, opacity: BOUND_OPACITY },
    { radius: ranges.total.low, color: TOTAL_COLOR, opacity: BOUND_OPACITY },
    { radius: ranges.total.mid, color: TOTAL_COLOR, opacity: MID_OPACITY },
    { radius: ranges.total.high, color: TOTAL_COLOR, opacity: BOUND_OPACITY },
  ];
}

function arcPath(center: LatLng, bearingToTarget: number, radius: number) {
  const start = bearingToTarget - ARC_SWEEP_DEGREES / 2;
  const step = ARC_SWEEP_DEGREES / ARC_STEPS;

  return Array.from({ length: ARC_STEPS + 1 }, (_, i) =>
    offsetPosition(center, start + i * step, radius)
  );
}

/**
 * Draws the club's carry and total distance bands as arcs on the ground, opening
 * towards the target. Polylines are map geometry rather than screen overlays, so
 * they stay pinned to the turf under the full screen map's tilt and heading.
 */
export function useClubRangeRings(
  map: google.maps.Map | null,
  center: LatLng | null | undefined,
  bearingToTarget: number | null,
  ranges: ClubRanges | null,
  strokeWeight: number
) {
  const drawnRef = useRef<google.maps.Polyline[]>([]);

  const canDraw = !!center && bearingToTarget !== null;
  const rings = canDraw ? toRings(ranges) : [];
  // Rebuilt every render, so compare by content rather than identity.
  const ringsKey = [
    center?.lat,
    center?.lng,
    bearingToTarget,
    strokeWeight,
    ...rings.map((ring) => ring.radius),
  ].join("|");

  useEffect(
    function syncRings() {
      const drawn = drawnRef.current;

      // Anything we no longer need goes first, so the survivors keep their index.
      drawn.slice(rings.length).forEach((ring) => ring.setMap(null));
      drawnRef.current = drawn.slice(0, rings.length);

      if (!map || !center || bearingToTarget === null) return;

      rings.forEach((ring, i) => {
        const path = arcPath(center, bearingToTarget, ring.radius);
        const existing = drawnRef.current[i];

        if (existing) {
          existing.setPath(path);
          existing.setOptions({
            strokeColor: ring.color,
            strokeOpacity: ring.opacity,
            strokeWeight,
          });
          return;
        }

        drawnRef.current[i] = new google.maps.Polyline({
          map,
          path,
          strokeColor: ring.color,
          strokeOpacity: ring.opacity,
          strokeWeight,
          clickable: false,
          zIndex: RING_Z_INDEX,
        });
      });
    },
    // ringsKey stands in for center, bearing, stroke weight and the ring radii
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, ringsKey]
  );

  useEffect(
    () => () => {
      drawnRef.current.forEach((ring) => ring.setMap(null));
      drawnRef.current = [];
    },
    []
  );
}
