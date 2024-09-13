import { BASE_PATH } from "App";
import { useEffect, useState } from "react";

export function useUpdateUserPin(userLocation: any, map: any, mapRef: any) {
  const gmaps = window.google?.maps; // Assuming you have a Maps Maps API script loaded with your API key

  const [userMarker, setUserMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(
    function updateUserPosition() {
      if (userLocation && map) {
        if (!userMarker) {
          const _userMarker = new google.maps.marker.AdvancedMarkerElement({
            map: mapRef.current,
            position: userLocation,
            content: document.createElement("div"),
          });
          const pinContent = _userMarker?.content as HTMLDivElement;
          if (pinContent?.style) {
            pinContent.style.backgroundImage = `url('${BASE_PATH}/images/ball-pin.png')`;
            pinContent.style.backgroundSize = "cover";
            pinContent.style.width = "10px";
            pinContent.style.height = "19px";
            pinContent.style.position = "relative";
          }

          setUserMarker(_userMarker);
        } else {
          userMarker.position = userLocation;
          setUserMarker(userMarker);
        }
      }
    },
    [
      gmaps?.marker?.AdvancedMarkerElement,
      userLocation,
      map,
      mapRef,
      userMarker,
    ]
  );
}
