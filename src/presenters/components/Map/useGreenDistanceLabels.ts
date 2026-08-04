/// <reference types="@types/google.maps" />

import { useCallback, useEffect, useRef } from "react";
import { LatLng } from "model/LatLng";
import {
  GreenDistance,
  GreenPointKey,
} from "usecases/hole/calculateGreenDistances";
import { spreadLabels } from "./spreadLabels";

const DOT_SIZE_PX = 7;
const LABEL_HEIGHT_PX = 16;
const LABEL_GAP_PX = 3;
/** Clears both the white dot and, at the pin, the flag icon. */
const LABEL_OFFSET_X_PX = 11;
/** Above the tee, ball and flag markers. */
const LABEL_Z_INDEX = 50;
/** How long to keep waiting for the map to place the markers before giving up. */
const RELAYOUT_TIMEOUT_MS = 5000;

/** Front to back, so the labels always stack in a predictable order. */
const GREEN_POINT_KEYS: GreenPointKey[] = ["front", "pin", "back"];

/** The flag already marks the pin, so it needs no dot of its own. */
const KEYS_WITH_DOT: GreenPointKey[] = ["front", "back"];

type LabelSpec = {
  key: GreenPointKey;
  pos: LatLng;
  text: string;
  withDot: boolean;
};

type LabelMarker = {
  marker: google.maps.marker.AdvancedMarkerElement;
  /** Zero-sized element sitting exactly on the point, used to measure it. */
  anchor: HTMLDivElement;
  label: HTMLDivElement;
};

function toLabelSpec({ key, pos, distance }: GreenDistance): LabelSpec {
  return {
    key,
    pos,
    text: `${Math.round(distance)}`,
    withDot: KEYS_WITH_DOT.includes(key),
  };
}

function createLabelMarker(map: google.maps.Map, spec: LabelSpec): LabelMarker {
  const anchor = document.createElement("div");
  anchor.style.position = "relative";
  anchor.style.width = "0";
  anchor.style.height = "0";
  // Let taps fall through to the map underneath.
  anchor.style.pointerEvents = "none";

  if (spec.withDot) {
    const dot = document.createElement("div");
    dot.style.position = "absolute";
    dot.style.left = `${-DOT_SIZE_PX / 2}px`;
    dot.style.top = `${-DOT_SIZE_PX / 2}px`;
    dot.style.width = `${DOT_SIZE_PX}px`;
    dot.style.height = `${DOT_SIZE_PX}px`;
    dot.style.borderRadius = "50%";
    dot.style.backgroundColor = "white";
    dot.style.boxShadow = "0 0 3px rgba(0, 0, 0, 0.9)";
    anchor.appendChild(dot);
  }

  const label = document.createElement("div");
  label.style.position = "absolute";
  label.style.left = `${LABEL_OFFSET_X_PX}px`;
  label.style.top = "0";
  label.style.height = `${LABEL_HEIGHT_PX}px`;
  label.style.lineHeight = `${LABEL_HEIGHT_PX}px`;
  label.style.whiteSpace = "nowrap";
  label.style.color = "white";
  label.style.fontSize = "13px";
  label.style.fontWeight = "700";
  label.style.textShadow =
    "0 0 3px rgba(0, 0, 0, 0.95), 0 1px 2px rgba(0, 0, 0, 0.9)";
  label.style.transform = `translateY(${-LABEL_HEIGHT_PX / 2}px)`;
  label.textContent = spec.text;
  anchor.appendChild(label);

  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: spec.pos,
    map,
    content: anchor,
    zIndex: LABEL_Z_INDEX,
  });

  return { marker, anchor, label };
}

/**
 * Pins each green distance to its point on the map. Google places the markers,
 * so the label positions stay honest under the map's tilt and heading; we only
 * read them back to keep the labels from covering each other.
 */
export function useGreenDistanceLabels(
  map: google.maps.Map | null,
  distances: GreenDistance[],
  enabled: boolean
) {
  const markersRef = useRef<Partial<Record<GreenPointKey, LabelMarker>>>({});

  const specs = enabled ? distances.map(toLabelSpec) : [];
  // Rebuilt every render, so compare by content rather than identity.
  const specsKey = specs
    .map((spec) => `${spec.key}@${spec.pos.lat},${spec.pos.lng}=${spec.text}`)
    .join("|");
  const specsRef = useRef(specs);
  specsRef.current = specs;

  /** False while the markers are still unmeasurable, so callers can retry. */
  const relayoutLabels = useCallback(
    function relayoutLabels() {
      if (!map) return false;

      const visible = GREEN_POINT_KEYS.map(
        (key) => markersRef.current[key]
      ).filter((labelMarker): labelMarker is LabelMarker => !!labelMarker);
      if (visible.length === 0) return true;

      // Google only attaches marker content once the map renderer is ready.
      // Measuring before that reads every position as zero, which would pile the
      // labels on top of each other instead of spreading them.
      if (visible.some(({ anchor }) => !anchor.isConnected)) return false;

      const mapTop = map.getDiv().getBoundingClientRect().top;
      const anchoredAt = visible.map(
        ({ anchor }) => anchor.getBoundingClientRect().top - mapTop
      );
      const centers = spreadLabels(
        anchoredAt.map((center) => ({ center, size: LABEL_HEIGHT_PX })),
        LABEL_GAP_PX
      );

      visible.forEach(({ label }, i) => {
        const offsetY = centers[i] - anchoredAt[i] - LABEL_HEIGHT_PX / 2;
        label.style.transform = `translateY(${offsetY}px)`;
      });
      return true;
    },
    [map]
  );

  useEffect(
    function syncLabelMarkers() {
      if (!map) return;

      const markers = markersRef.current;
      const wanted = specsRef.current;

      GREEN_POINT_KEYS.forEach((key) => {
        const spec = wanted.find((candidate) => candidate.key === key);
        const existing = markers[key];

        if (!spec) {
          if (existing) {
            existing.marker.map = null;
            delete markers[key];
          }
          return;
        }

        if (existing) {
          existing.marker.position = spec.pos;
          existing.label.textContent = spec.text;
        } else {
          markers[key] = createLabelMarker(map, spec);
        }
      });

      // Keep trying until the markers are on screen and measurable. Camera
      // events take over from there.
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
    [map, specsKey, relayoutLabels]
  );

  useEffect(
    function relayoutOnCameraChange() {
      if (!map) return;

      let frame = 0;
      const scheduleRelayout = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          relayoutLabels();
        });
      };

      const listeners = [
        "bounds_changed",
        "center_changed",
        "zoom_changed",
        "heading_changed",
        "tilt_changed",
        "idle",
      ].map((event) => map.addListener(event, scheduleRelayout));

      return () => {
        if (frame) cancelAnimationFrame(frame);
        listeners.forEach((listener) => listener.remove());
      };
    },
    [map, relayoutLabels]
  );

  useEffect(
    () => () => {
      Object.values(markersRef.current).forEach((labelMarker) => {
        if (labelMarker) labelMarker.marker.map = null;
      });
      markersRef.current = {};
    },
    []
  );
}
