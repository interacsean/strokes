import { useState, useRef } from "react";
import { useInitialiseMap } from "./useInitialiseMap";
import { useUpdateUserPin } from "./useUpdateUserPin";
import { Hole } from "model/Hole";
import { LatLng } from "model/LatLng";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";
import { selectCurrentPinFromHole } from "state/course/selectors/currentPin";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";
import './mapStyles.css';

type GoogleMap = any;

type MapProps = {
  hole: Hole;
  currentPosition: LatLng;
  mapId?: string;
  holeOrientation?: "horizontal" | "vertical",
  zoomFactor?: number;
  tilt?: number;
};

function useViewLogic(props: MapProps, map: GoogleMap) {
  const { holeOrientation = "vertical" } = props;
  // todo: optimisation
  const teePos = selectCurrentTeeFromHole(props.hole)?.pos;
  const pinPos = selectCurrentPinFromHole(props.hole);

  if (teePos && pinPos && map) {
    const tiltRadians = ((props.tilt || 0) * Math.PI) / 180;
    const weightFactor = Math.sin(tiltRadians) / 6;

    const centerLat = (teePos.lat * (0.5 + weightFactor) + pinPos.lat * (0.5 - weightFactor));
    const centerLng = (teePos.lng * (0.5 + weightFactor) + pinPos.lng * (0.5 - weightFactor));

    const distance = calculateDistanceBetweenPositions(teePos, pinPos);

    const screenSizeFactor = 1; // todo: on a normal mobile screen this should be 1, for larger screens, this will need to scale out, probably based on largest dimension of the containing element
    const bufferFactor = 1.05;
    const mapSize = 50000000 * screenSizeFactor * (props.zoomFactor || 1);
    const zoomLevel = Math.log2(mapSize / (distance * bufferFactor));

    // @ts-ignore
    map.panTo(new google.maps.LatLng(centerLat, centerLng));
    map.setZoom(zoomLevel);
    console.log("zoom", map.getZoom());

    const latDiff = pinPos.lat - teePos.lat;
    const avgLat = (teePos.lat + pinPos.lat) / 2;
    const lngDiff =
      (pinPos.lng - teePos.lng) * Math.cos((avgLat * Math.PI) / 180); // Adjust lngDiff by cosine of average latitude

    const angleRad = Math.atan2(lngDiff, latDiff); // Note: reversed latDiff and lngDiff
    const angleDeg = (angleRad * 180) / Math.PI;
    const bearingDeg = (angleDeg + 360 + (holeOrientation === "horizontal" ? -90 : 0)) % 360;
    map.setHeading(bearingDeg);
    map.setTilt(props.tilt || 0);

    // todo track the markers so they don't keep getting added
    // Add a marker at the tee position
    // @ts-ignore
    new window.google.maps.Marker({
      position: teePos,
      map: map,
      title: "Tee Position",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // Custom marker for tee
      },
    });

    // Add a marker at the pin position
    // @ts-ignore
    new window.google.maps.Marker({
      position: pinPos,
      map: map,
      title: "Pin Position",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Custom marker for pin
      },
    });
  }
}

function Map({
  mapId = "map",
  ...props
}: MapProps) {
  const [map, setMap] = useState<GoogleMap | null>(null);
  const userLocation = props.currentPosition;
  useViewLogic(props, map);

  const mapRef = useRef<GoogleMap | null>(null); // Ref for map instance

  useInitialiseMap(mapId, map, setMap, mapRef);
  useUpdateUserPin(userLocation, map, mapRef);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div id={mapId} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
}

export default Map;
