/// <reference types="@types/google.maps" />

import { useCallback, useEffect, useRef, useState } from "react";
import { LatLng } from "model/LatLng";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";
import {
  placeLineLabel,
  ScreenBox,
  ScreenPoint,
  visibleRun,
} from "./placeLineLabel";

const LINE_COLOR = "#ffffff";
/** Over the stroke path, under the markers. */
const LINE_Z_INDEX = 3;
/** Over the ball, tee and pin, so it can always be picked up. */
const POINT_Z_INDEX = 60;
/** Big enough to put a thumb on; the ring inside it is what shows. */
const POINT_HIT_SIZE_PX = 32;
const POINT_RING_SIZE_PX = 14;

/** Spread onto the buttons and readouts laid over a map, so the labels keep
 * out from under them. */
export const MAP_OVERLAY_PROPS = { "data-map-overlay": true };
const MAP_OVERLAY_SELECTOR = "[data-map-overlay]";

const LABEL_HEIGHT_PX = 18;
const LABEL_GAP_PX = 4;
/** Keeps the labels off the very edge of the map. */
const LABEL_INSET_PX = 4;
/** Points sampled along each line to find the part of it that is on screen. */
const LINE_SAMPLES = 24;
/** How long to keep waiting for the map to be measurable before giving up. */
const RELAYOUT_TIMEOUT_MS = 5000;

/** From the player's ball first, so its label gets the first pick of spots. */
const LINE_KEYS = ["from", "pin"] as const;
type LineKey = (typeof LINE_KEYS)[number];

type MeasureLine = {
  line: google.maps.Polyline;
  label: HTMLDivElement;
};

/** Google hands positions back as plain numbers or as getters, depending. */
type AnyLatLng = {
  lat: number | (() => number);
  lng: number | (() => number);
};
function toLatLng(pos: AnyLatLng): LatLng {
  // A map panned across the world reports its centre past ±180°; LatLng
  // wraps it back.
  const wrapped = new google.maps.LatLng(
    typeof pos.lat === "function" ? pos.lat() : pos.lat,
    typeof pos.lng === "function" ? pos.lng() : pos.lng
  );
  return { lat: wrapped.lat(), lng: wrapped.lng(), alt: null };
}

const between = (a: LatLng, b: LatLng, t: number) => ({
  lat: a.lat + (b.lat - a.lat) * t,
  lng: a.lng + (b.lng - a.lng) * t,
});

function createPointContent() {
  const hit = document.createElement("div");
  hit.style.width = `${POINT_HIT_SIZE_PX}px`;
  hit.style.height = `${POINT_HIT_SIZE_PX}px`;
  hit.style.display = "flex";
  hit.style.alignItems = "center";
  hit.style.justifyContent = "center";
  // The marker hangs from its bottom centre; this puts its centre on the point.
  hit.style.transform = "translateY(50%)";
  hit.style.cursor = "grab";
  hit.style.touchAction = "none";

  const ring = document.createElement("div");
  ring.style.width = `${POINT_RING_SIZE_PX}px`;
  ring.style.height = `${POINT_RING_SIZE_PX}px`;
  ring.style.boxSizing = "border-box";
  ring.style.borderRadius = "50%";
  ring.style.border = `3px solid ${LINE_COLOR}`;
  ring.style.backgroundColor = "rgba(0, 0, 0, 0.35)";
  ring.style.boxShadow = "0 0 3px rgba(0, 0, 0, 0.9)";
  hit.appendChild(ring);

  return hit;
}

function createLabel(overlay: HTMLDivElement) {
  const label = document.createElement("div");
  label.style.position = "absolute";
  label.style.left = "0";
  label.style.top = "0";
  label.style.height = `${LABEL_HEIGHT_PX}px`;
  label.style.lineHeight = `${LABEL_HEIGHT_PX}px`;
  label.style.padding = "0 5px";
  label.style.borderRadius = `${LABEL_HEIGHT_PX / 2}px`;
  label.style.whiteSpace = "nowrap";
  label.style.color = "white";
  label.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
  label.style.fontSize = "13px";
  label.style.fontWeight = "700";
  // Hidden until it has somewhere to go.
  label.style.visibility = "hidden";
  overlay.appendChild(label);
  return label;
}

type MeasureToolParams = {
  map: google.maps.Map | null;
  active: boolean;
  /** Where the player is hitting from. */
  fromPos: LatLng | null | undefined;
  pinPos: LatLng | null | undefined;
  strokeWeight: number;
};

/**
 * A point the player puts down on the map — by tapping, or dragging the one
 * already there — joined by a line to where they are hitting from and another to
 * the pin, each labelled with how far it is.
 *
 * The lines are map geometry, so they stay pinned to the ground under the full
 * screen map's tilt and heading. The labels are laid over the map instead, so
 * they can be kept on screen even when the far end of a line is not.
 */
export function useMeasureTool({
  map,
  active,
  fromPos,
  pinPos,
  strokeWeight,
}: MeasureToolParams) {
  const [point, setPoint] = useState<LatLng | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const pointMarkerRef =
    useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const linesRef = useRef<Partial<Record<LineKey, MeasureLine>>>({});
  // Reads where each point is on screen, tilt and heading included.
  const projectionRef = useRef<google.maps.OverlayView | null>(null);
  const draggingRef = useRef(false);

  const shown = active && !!map && !!point;
  const ends: Record<LineKey, LatLng | null> = {
    from: shown ? fromPos ?? null : null,
    pin: shown ? pinPos ?? null : null,
  };
  const endsRef = useRef({ point, ends });
  endsRef.current = { point, ends };
  const geometryKey = shown
    ? [point, ends.from, ends.pin]
        .map((pos) => (pos ? `${pos.lat},${pos.lng}` : "-"))
        .join("|")
    : "";

  // Start halfway to the pin, which the map frames. Its centre would do too,
  // but reads wherever the camera is part way through moving to.
  useEffect(
    function placeOrClearPoint() {
      if (!active) setPoint(null);
      else if (map && !point) {
        const start =
          fromPos && pinPos ? between(fromPos, pinPos, 0.5) : map.getCenter();
        if (start) setPoint(toLatLng(start));
      }
    },
    // Where to start only matters at the start.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active, map, point]
  );

  /** False while the map can't be measured yet, so callers can retry. */
  const relayoutLabels = useCallback(
    function relayoutLabels() {
      const projection = projectionRef.current?.getProjection();
      if (!map || !projection) return false;

      const div = map.getDiv();
      const viewport = { width: div.clientWidth, height: div.clientHeight };
      const { point: measurePoint, ends: lineEnds } = endsRef.current;

      const runs = LINE_KEYS.map((key) => {
        const end = lineEnds[key];
        if (!measurePoint || !end) return null;
        const samples = Array.from({ length: LINE_SAMPLES + 1 }, (_, i) => {
          const pixel = projection.fromLatLngToContainerPixel(
            new google.maps.LatLng(between(measurePoint, end, i / LINE_SAMPLES))
          );
          return pixel ? { x: pixel.x, y: pixel.y } : null;
        });
        return visibleRun(samples, viewport);
      });

      // The labels keep clear of the point itself, and of whatever is laid over
      // the map.
      const mapRect = div.getBoundingClientRect();
      const overlays: ScreenBox[] = Array.from(
        document.querySelectorAll(MAP_OVERLAY_SELECTOR),
        (element) => {
          const rect = element.getBoundingClientRect();
          return {
            x: rect.left - mapRect.left,
            y: rect.top - mapRect.top,
            width: rect.width,
            height: rect.height,
          };
        }
      );
      const pointPixel =
        measurePoint &&
        projection.fromLatLngToContainerPixel(
          new google.maps.LatLng(measurePoint)
        );
      if (pointPixel) {
        overlays.push({
          x: pointPixel.x - POINT_RING_SIZE_PX / 2,
          y: pointPixel.y - POINT_RING_SIZE_PX / 2,
          width: POINT_RING_SIZE_PX,
          height: POINT_RING_SIZE_PX,
        });
      }

      const placed: ScreenBox[] = [];
      LINE_KEYS.forEach((key, i) => {
        const label = linesRef.current[key]?.label;
        if (!label) return;
        const run = runs[i];
        if (!run) {
          label.style.visibility = "hidden";
          return;
        }

        const otherRun = runs[1 - i];
        const otherDirection: ScreenPoint | null = otherRun
          ? {
              x: otherRun[1].x - otherRun[0].x,
              y: otherRun[1].y - otherRun[0].y,
            }
          : null;
        const box = placeLineLabel({
          run,
          otherDirection,
          label: { width: label.offsetWidth, height: label.offsetHeight },
          viewport,
          gap: LABEL_GAP_PX,
          inset: LABEL_INSET_PX,
          avoid: [...overlays, ...placed],
        });
        placed.push(box);
        label.style.transform = `translate(${box.x}px, ${box.y}px)`;
        label.style.visibility = "visible";
      });
      return true;
    },
    [map]
  );

  useEffect(
    function syncMeasurePoint() {
      if (!map || !shown || !point) {
        if (pointMarkerRef.current) pointMarkerRef.current.map = null;
        pointMarkerRef.current = null;
        return;
      }

      if (pointMarkerRef.current) {
        // Mid drag the marker is already there, and moving it would fight the
        // player's finger.
        if (!draggingRef.current) pointMarkerRef.current.position = point;
        return;
      }

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: point,
        title: "Measure from here",
        content: createPointContent(),
        gmpDraggable: true,
        zIndex: POINT_Z_INDEX,
      });
      const moveTo = (e: google.maps.MapMouseEvent | undefined) => {
        const pos = e?.latLng ?? (marker.position as AnyLatLng | null);
        if (pos) setPoint(toLatLng(pos));
      };
      marker.addListener("dragstart", () => {
        draggingRef.current = true;
      });
      marker.addListener("drag", moveTo);
      marker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
        draggingRef.current = false;
        moveTo(e);
      });
      pointMarkerRef.current = marker;
    },
    [map, shown, point]
  );

  useEffect(
    function syncLinesAndLabels() {
      const overlay = overlayRef.current;
      const lines = linesRef.current;
      const { point: measurePoint, ends: lineEnds } = endsRef.current;

      LINE_KEYS.forEach((key) => {
        const end = lineEnds[key];
        const existing = lines[key];

        if (!map || !overlay || !measurePoint || !end) {
          if (existing) {
            existing.line.setMap(null);
            existing.label.remove();
            delete lines[key];
          }
          return;
        }

        const path = [measurePoint, end];
        const measureLine = existing ?? {
          line: new google.maps.Polyline({
            map,
            path,
            strokeColor: LINE_COLOR,
            strokeOpacity: 1,
            strokeWeight,
            // Taps on the line move the point, like anywhere else on the map.
            clickable: false,
            zIndex: LINE_Z_INDEX,
          }),
          label: createLabel(overlay),
        };
        measureLine.line.setOptions({ path, strokeWeight });
        measureLine.label.textContent = `${Math.round(
          calculateDistanceBetweenPositions(measurePoint, end)
        )}`;
        lines[key] = measureLine;
      });

      // Keep trying until the map can be measured. Camera changes take over
      // from there.
      let frame = 0;
      let startedAt: number | null = null;
      const attemptRelayout = (now: number) => {
        if (startedAt === null) startedAt = now;
        if (relayoutLabels() || now - startedAt > RELAYOUT_TIMEOUT_MS) return;
        frame = requestAnimationFrame(attemptRelayout);
      };
      frame = requestAnimationFrame(attemptRelayout);
      return () => cancelAnimationFrame(frame);
    },
    // geometryKey stands in for the point and the ends of the lines
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, geometryKey, strokeWeight, relayoutLabels]
  );

  useEffect(
    function relayoutOnCameraChange() {
      if (!map || !shown) return;

      let frame = 0;
      const scheduleRelayout = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          relayoutLabels();
        });
      };

      const projection = new google.maps.OverlayView();
      projection.onAdd = scheduleRelayout;
      // Called whenever the camera moves, tilt and heading included.
      projection.draw = scheduleRelayout;
      projection.onRemove = () => {};
      projection.setMap(map);
      projectionRef.current = projection;

      const listeners = [
        "bounds_changed",
        "heading_changed",
        "tilt_changed",
      ].map((event) => map.addListener(event, scheduleRelayout));
      // The map changes size when the full screen map's details are tucked away.
      const resizeObserver = new ResizeObserver(scheduleRelayout);
      resizeObserver.observe(map.getDiv());

      return () => {
        if (frame) cancelAnimationFrame(frame);
        listeners.forEach((listener) => listener.remove());
        resizeObserver.disconnect();
        projection.setMap(null);
        projectionRef.current = null;
      };
    },
    [map, shown, relayoutLabels]
  );

  useEffect(
    () => () => {
      if (pointMarkerRef.current) pointMarkerRef.current.map = null;
      Object.values(linesRef.current).forEach((measureLine) => {
        measureLine?.line.setMap(null);
        measureLine?.label.remove();
      });
      linesRef.current = {};
    },
    []
  );

  return { overlayRef, setPoint };
}
