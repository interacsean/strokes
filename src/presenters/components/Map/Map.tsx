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
import { ClubRanges } from "usecases/stroke/calculateClubRanges";

type GoogleMap = any;

/** The mini map is small enough that a 2px+ stroke reads as a solid band. */
const MINI_MAP_ID = "miniMap";
const CLUB_RANGE_STROKE_WEIGHT = {
  mini: 1,
  full: 2,
};

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

function useViewLogic(props: MapProps, map: google.maps.Map | null) {
  const { holeOrientation = "vertical" } = props;
  // todo: optimisation
  const teePos = selectCurrentTeeFromHole(props.hole)?.pos;
  const pinPos = selectCurrentPinFromHole(props.hole);

  const pinMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const teeMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const ballMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  if (teePos && pinPos && map) {
    const tiltRadians = ((props.tilt || 0) * Math.PI) / 180;
    const weightFactor = Math.sin(tiltRadians) / 6;

    const centerLat =
      teePos.lat * (0.5 + weightFactor) + pinPos.lat * (0.5 - weightFactor);
    const centerLng =
      teePos.lng * (0.5 + weightFactor) + pinPos.lng * (0.5 - weightFactor);

    const distance = calculateDistanceBetweenPositions(teePos, pinPos);

    const screenSizeFactor = 1; // todo: on a normal mobile screen this should be 1, for larger screens, this will need to scale out, probably based on largest dimension of the containing element
    const bufferFactor = 1.05;
    const mapSize = 50000000 * screenSizeFactor * (props.zoomFactor || 1);
    const zoomLevel = Math.log2(mapSize / (distance * bufferFactor));

    map.panTo(new google.maps.LatLng(centerLat, centerLng));
    map.setZoom(zoomLevel);

    const latDiff = pinPos.lat - teePos.lat;
    const avgLat = (teePos.lat + pinPos.lat) / 2;
    const lngDiff =
      (pinPos.lng - teePos.lng) * Math.cos((avgLat * Math.PI) / 180); // Adjust lngDiff by cosine of average latitude

    const angleRad = Math.atan2(lngDiff, latDiff); // Note: reversed latDiff and lngDiff
    const angleDeg = (angleRad * 180) / Math.PI;
    const bearingDeg =
      (angleDeg + 360 + (holeOrientation === "horizontal" ? -90 : 0)) % 360;
    map.setHeading(bearingDeg);
    map.setTilt(props.tilt || 0);
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
  useViewLogic(props, map);

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
