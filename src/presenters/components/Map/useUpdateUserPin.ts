import { useEffect, useState } from "react";

export function useUpdateUserPin(userLocation: any, map: any, mapRef: any) {
  // @ts-ignore - todo: fix window
  const gmaps = window.google?.maps; // Assuming you have a Maps Maps API script loaded with your API key

  const [userMarker, setUserMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(
    function updateUserPosition() {
      // @ts-ignore
      if (userLocation && map) {
        if (!userMarker) {
          const _userMarker = new google.maps.marker.AdvancedMarkerElement({
            map: mapRef.current,
            position: userLocation,
            content: document.createElement("div"),
          });
          // const iconImage = document.createElement("img");
          // iconImage.src =
          //   // "https://developers.google.com/maps/documentation/javascript/examples/full/images/parking_lot_maps.png";
          //   'data:image/svg+xml;charset=utf-8,<svg width="20" height="20"><circle cx="10" cy="10" r="8" fill="#007bff" /></svg>';

          // Set the custom icon as background image for the marker
          const pinContent = _userMarker?.content as HTMLDivElement;
          if (pinContent?.style) {
            pinContent.style.backgroundImage = "url('/images/ball-pin.png')";
            pinContent.style.backgroundSize = "cover";
            pinContent.style.width = "10px"; // Set width to your icon's width
            pinContent.style.height = "19px"; // Set height to your icon's height
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
      // @ts-ignore
      gmaps?.marker?.AdvancedMarkerElement,
      userLocation,
      map,
      mapRef,
      userMarker,
    ]
  );
}
