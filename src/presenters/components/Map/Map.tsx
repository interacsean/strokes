/// <reference types="@types/google.maps" />

import { useState, useRef, useEffect } from "react";
import { useInitialiseMap } from "./useInitialiseMap";
import { useUpdateUserPin } from "./useUpdateUserPin";
import { useGreenDistanceLabels } from "./useGreenDistanceLabels";
import { useClubRangeRings } from "./useClubRangeRings";
import { useStrokePath } from "./useStrokePath";
import { Hole } from "model/Hole";
import { LatLng } from "model/LatLng";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";
import { selectCurrentPinFromHole } from "state/course/selectors/currentPin";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";
import "./mapStyles.css";
import { useFakeGps } from "../FakePos/FakePosContext";
import { BASE_PATH } from "App";
import { Flex } from "@chakra-ui/react";
import { GpsAccuracy } from "presenters/components/GpsAccuracy/GpsAccuracy";
import { GreenDistances } from "presenters/components/GreenDistances/GreenDistances";
import { calculateGreenDistances } from "usecases/hole/calculateGreenDistances";
import { calculateBearingBetweenPositions } from "usecases/hole/calculateBearingBetweenPositions";
import { calculateMapCamera } from "usecases/hole/calculateMapCamera";
import { selectApproachPosFromHole } from "state/course/selectors/approachPos";
import { ClubRanges } from "usecases/stroke/calculateClubRanges";

type GoogleMap = any;

/** What the map frames: the whole hole, or just the stroke in hand. */
export type MapFrame = "hole" | "stroke";

/** The mini map is small enough that a 2px+ stroke reads as a solid band. */
const MINI_MAP_ID = "miniMap";
const CLUB_RANGE_STROKE_WEIGHT = {
  mini: 1,
  full: 2,
};

/** Inside this the shot is a chip or a putt, played from wherever around the
 * green the last one finished. Facing the ball from there would swing the view
 * around with every step, so it faces the way the hole is played in instead.
 * It takes a few metres more to leave that view than to enter it, so a ball
 * sitting on the boundary doesn't swing the map back and forth. */
const CLOSE_RANGE_METRES = { enter: 60, leave: 65 };

/** How little ground the view may show across the hole — the mini map's height,
 * the full screen map's width. An average green, or a big green's own depth. */
const MIN_ACROSS_HOLE_METRES = 16;

/** The full screen map has the room to leave a margin around that. */
const FULL_MAP_MARGIN = 1.15;

/** Ground kept clear around the ball, so its marker has somewhere to sit rather
 * than clinging to the edge of a view stretched to just barely reach it. */
const BALL_CLEARANCE_METRES = 7;

/** Metres of ground one screen spans at zoom 0, along the hole. */
const MAP_SIZE_AT_ZOOM_0 = 50000000;

type MapProps = {
  hole: Hole;
  ballPos: LatLng | null;
  currentPosition: LatLng;
  mapId?: string;
  holeOrientation?: "horizontal" | "vertical";
  zoomFactor?: number;
  tilt?: number;
  onMapClick?: (pos: LatLng) => void;
  gpsAccuracy?: number | null;
  /** Pins the green distances to the points they belong to. */
  showGreenDistanceLabels?: boolean;
  /** Sums the green distances up in one readout beside the GPS accuracy. */
  showGreenDistanceReadout?: boolean;
  /** Where those distances are measured from; falls back to the user's position. */
  measureDistancesFrom?: LatLng | null;
  /** Carry and total bands for the club in hand, drawn as arcs towards the pin. */
  clubRanges?: ClubRanges | null;
  /** Where the stroke was played from; drawn as a faded ball joined to ballPos
   * by a dashed line once the stroke has both ends. */
  strokeFromPos?: LatLng | null;
  /** Whether the view is framed on the whole hole (tee to pin) or on the stroke
   * in hand (strokeFromPos to pin). Defaults to the stroke. */
  frame?: MapFrame;
};

const createRotatedIcon = (
  url: string,
  rotation: number,
  callback: (iconUrl: string) => void
) => {
  const img = new Image();
  img.src = url;
  img.setAttribute("crossorigin", "anonymous");
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    const size = Math.max(img.width, img.height);
    canvas.width = size;
    canvas.height = size;

    context.translate(size / 2, size / 2);
    context.rotate((rotation * Math.PI) / 180);
    context.drawImage(img, -img.width / 2, -img.height / 2);

    callback(canvas.toDataURL());
  };
};

function useViewLogic(
  props: MapProps,
  map: google.maps.Map | null,
  mapId: string
) {
  const { holeOrientation = "vertical" } = props;
  // todo: optimisation
  const teePos = selectCurrentTeeFromHole(props.hole)?.pos;
  const pinPos = selectCurrentPinFromHole(props.hole);
  const approachPos = selectApproachPosFromHole(props.hole);

  // The stroke is framed from where it is played, falling back to the tee while
  // it has no position yet. The tee shot — and a stroke and distance replay of
  // it — start from the tee, so framing their stroke frames the hole anyway.
  const frameFromPos =
    props.frame === "hole" ? teePos : props.strokeFromPos ?? teePos;

  const pinMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const teeMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const ballMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const closeRangeRef = useRef(false);

  if (frameFromPos && pinPos && map) {
    const distanceToPin = calculateDistanceBetweenPositions(
      frameFromPos,
      pinPos
    );
    closeRangeRef.current =
      distanceToPin <=
      (closeRangeRef.current
        ? CLOSE_RANGE_METRES.leave
        : CLOSE_RANGE_METRES.enter);
    const closeRange = closeRangeRef.current;

    const green = props.hole.green;
    const greenDepth = green
      ? calculateDistanceBetweenPositions(green.front, green.back)
      : 0;

    const screenSizeFactor = 1; // todo: on a normal mobile screen this should be 1, for larger screens, this will need to scale out, probably based on largest dimension of the containing element
    const alongHoleMapSize =
      MAP_SIZE_AT_ZOOM_0 * screenSizeFactor * (props.zoomFactor || 1);
    // The hole lies across the map element on a horizontal orientation and runs
    // up it on a vertical one, so which side of the element is along the hole
    // and which is across it depends on the orientation.
    const mapDiv = map.getDiv();
    const alongPx =
      holeOrientation === "horizontal"
        ? mapDiv.clientWidth
        : mapDiv.clientHeight;
    const acrossPx =
      holeOrientation === "horizontal"
        ? mapDiv.clientHeight
        : mapDiv.clientWidth;

    const camera = calculateMapCamera({
      points: [
        { pos: frameFromPos, radius: BALL_CLEARANCE_METRES },
        pinPos,
        // Around the green it is the green and the ball that have to be in
        // view, not just the line between them.
        ...(closeRange ? [green?.front, green?.back, props.ballPos] : []),
      ],
      holeBearing: calculateBearingBetweenPositions(
        (closeRange && approachPos) || frameFromPos,
        pinPos
      ),
      orientation: holeOrientation,
      alongHoleMapSize,
      acrossHoleMapSize:
        alongPx > 0
          ? alongHoleMapSize * (acrossPx / alongPx)
          : alongHoleMapSize,
      minAcrossHoleSpan:
        Math.max(MIN_ACROSS_HOLE_METRES, greenDepth) *
        (mapId === MINI_MAP_ID ? 1 : FULL_MAP_MARGIN),
      tilt: props.tilt || 0,
    });

    if (camera) {
      map.panTo(new google.maps.LatLng(camera.center.lat, camera.center.lng));
      map.setZoom(camera.zoom);
      map.setHeading(camera.heading);
      map.setTilt(props.tilt || 0);
    }
  }

  useEffect(() => {
    if (map && props.ballPos) {
      if (ballMarkerRef.current) {
        ballMarkerRef.current.position = props.ballPos;
      } else {
        ballMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
          position: props.ballPos,
          map: map,
          title: "Ball Position",
          content: document.createElement("div"),
        });
      }

      const ballContent = ballMarkerRef.current?.content as HTMLDivElement;
      if (ballContent?.style) {
        ballContent.style.backgroundImage = `url('${BASE_PATH}/images/ball.png')`;
        ballContent.style.backgroundSize = "cover";
        ballContent.style.width = "16px";
        ballContent.style.height = "16px";
        // ballContent.style.left = "-8px";
        ballContent.style.bottom = "-8px";
        ballContent.style.position = "relative";
      }
    }
  }, [props.ballPos, map]);

  useEffect(() => {
    if (map && teePos) {
      if (teeMarkerRef.current) {
        teeMarkerRef.current.position = teePos;
      } else {
        teeMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
          position: teePos,
          map: map,
          title: "Tee Position",
          content: document.createElement("div"),
        });

        createRotatedIcon(
          `${BASE_PATH}/images/white-tees.png`,
          holeOrientation === "horizontal" ? 90 : 0,
          (iconUrl: string) => {
            const teeContent = teeMarkerRef.current?.content as HTMLDivElement;
            if (teeContent?.style) {
              teeContent.style.backgroundImage = `url('${iconUrl}')`;
              teeContent.style.backgroundSize = "cover";
              teeContent.style.width = "21px";
              teeContent.style.height = "21px";
              teeContent.style.bottom = "-11px";
              teeContent.style.position = "relative";
            }
          }
        );
      }
    }
    if (map && pinPos) {
      if (pinMarkerRef.current) {
        pinMarkerRef.current.position = pinPos;
      } else {
        pinMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
          position: pinPos,
          map: map,
          title: "Pin Position",
          content: document.createElement("div"),
        });

        const pinContent = pinMarkerRef.current?.content as HTMLDivElement;
        if (pinContent?.style) {
          pinContent.style.backgroundImage = `url('${BASE_PATH}/images/flag.png')`;
          pinContent.style.backgroundSize = "cover";
          pinContent.style.width = "10px";
          pinContent.style.height = "15.5px";
          pinContent.style.left = "3px";
          pinContent.style.position = "relative";
        }
      }
    }
  }, [pinPos, map]);

  const { setFakePos } = useFakeGps();
  useEffect(() => {
    if (map) {
      const listener = map.addListener(
        "click",
        // @ts-ignore
        (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            if (props.onMapClick) {
              props.onMapClick?.({ lat, lng, alt: null });
            } else {
              setFakePos({ lat, lng });
            }
          }
        }
      );

      // Cleanup listener on component unmount
      return () => {
        if (listener) {
          // @ts-ignore
          google.maps.event.removeListener(listener);
        }
      };
    }
  }, [map, props]);
}

function Map({ mapId = "map", ...props }: MapProps) {
  const [map, setMap] = useState<GoogleMap | null>(null);
  const userLocation = props.currentPosition;
  useViewLogic(props, map, mapId);

  const mapRef = useRef<GoogleMap | null>(null); // Ref for map instance

  useInitialiseMap(mapId, map, setMap, mapRef);
  useUpdateUserPin(userLocation, map, mapRef);

  useStrokePath(map, props.strokeFromPos, props.ballPos);

  const measureFrom = props.measureDistancesFrom ?? props.currentPosition;
  const greenDistances = calculateGreenDistances(props.hole, measureFrom);
  useGreenDistanceLabels(map, greenDistances, !!props.showGreenDistanceLabels);

  // The rings open towards the pin, which is where the player is lining up from
  // wherever they currently are — not the tee-to-pin line the map is oriented on.
  const pinPos = selectCurrentPinFromHole(props.hole);
  const bearingToPin =
    measureFrom && pinPos
      ? calculateBearingBetweenPositions(measureFrom, pinPos)
      : null;
  useClubRangeRings(
    map,
    measureFrom,
    bearingToPin,
    props.clubRanges ?? null,
    mapId === MINI_MAP_ID
      ? CLUB_RANGE_STROKE_WEIGHT.mini
      : CLUB_RANGE_STROKE_WEIGHT.full
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div id={mapId} style={{ width: "100%", height: "100%" }}></div>
      <Flex
        position="absolute"
        bottom={1}
        right={1}
        columnGap={1}
        alignItems="center"
        pointerEvents="none"
      >
        {props.showGreenDistanceReadout && (
          <GreenDistances distances={greenDistances} />
        )}
        <GpsAccuracy accuracy={props.gpsAccuracy} />
      </Flex>
    </div>
  );
}

export default Map;
