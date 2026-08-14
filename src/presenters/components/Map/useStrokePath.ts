/// <reference types="@types/google.maps" />

import { useEffect, useRef } from "react";
import { LatLng } from "model/LatLng";
import { samePosition } from "usecases/hole/samePosition";
import { BASE_PATH } from "App";

/** The ball has already been played from here, so it sits back from the live one. */
const START_BALL_OPACITY = 0.5;
/** Under the markers, above the imagery. */
const PATH_Z_INDEX = 2;
const DASH_LENGTH_PX = 8;

/** Google Maps has no dash style; a repeated line symbol along an invisible
 * polyline is how a dashed stroke is drawn. */
const DASH_SYMBOL: google.maps.Symbol = {
  path: "M 0,-1 0,1",
  strokeColor: "#ffffff",
  strokeOpacity: 1,
  strokeWeight: 2,
  scale: 2,
};

/**
 * Draws where the stroke was played from: a faded ball at the start and a dashed
 * white line running to where it came to rest.
 */
export function useStrokePath(
  map: google.maps.Map | null,
  fromPos: LatLng | null | undefined,
  toPos: LatLng | null | undefined
) {
  const lineRef = useRef<google.maps.Polyline | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  const draw = !!map && !!fromPos && !!toPos && !samePosition(fromPos, toPos);
  const pathKey = draw
    ? [fromPos.lat, fromPos.lng, toPos.lat, toPos.lng].join("|")
    : "";

  useEffect(
    function syncStrokePath() {
      if (!draw) {
        lineRef.current?.setMap(null);
        lineRef.current = null;
        if (markerRef.current) markerRef.current.map = null;
        markerRef.current = null;
        return;
      }

      const path = [fromPos, toPos];

      if (lineRef.current) {
        lineRef.current.setPath(path);
      } else {
        lineRef.current = new google.maps.Polyline({
          map,
          path,
          // The line itself is invisible; the repeated dash symbol is what shows.
          strokeOpacity: 0,
          icons: [
            {
              icon: DASH_SYMBOL,
              offset: "0",
              repeat: `${DASH_LENGTH_PX * 2}px`,
            },
          ],
          clickable: false,
          zIndex: PATH_Z_INDEX,
        });
      }

      if (markerRef.current) {
        markerRef.current.position = fromPos;
      } else {
        const content = document.createElement("div");
        content.style.backgroundImage = `url('${BASE_PATH}/images/ball.png')`;
        content.style.backgroundSize = "cover";
        content.style.width = "16px";
        content.style.height = "16px";
        content.style.bottom = "-8px";
        content.style.position = "relative";
        content.style.opacity = `${START_BALL_OPACITY}`;

        markerRef.current = new google.maps.marker.AdvancedMarkerElement({
          position: fromPos,
          map,
          title: "Stroke start",
          content,
        });
      }
    },
    // pathKey stands in for the from and to positions
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, draw, pathKey]
  );

  useEffect(
    () => () => {
      lineRef.current?.setMap(null);
      if (markerRef.current) markerRef.current.map = null;
    },
    []
  );
}
