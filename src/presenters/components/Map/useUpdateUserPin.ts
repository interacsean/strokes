import { useEffect, useState } from "react";

export function useUpdateUserPin(userLocation: any, map: any, mapRef: any) {
  // @ts-ignore - todo: fix window
  const gmaps = window.google?.maps; // Assuming you have a Maps Maps API script loaded with your API key

  const [userMarker, setUserMarker] = useState(null);

  useEffect(
    function updateUserPosition() {
      // @ts-ignore
      if (userLocation && map && gmaps?.marker?.AdvancedMarkerElement) {
        if (!userMarker) {
          const iconImage = document.createElement("img");
          iconImage.src =
            // "https://developers.google.com/maps/documentation/javascript/examples/full/images/parking_lot_maps.png";
            'data:image/svg+xml;charset=utf-8,<svg width="20" height="20"><circle cx="10" cy="10" r="8" fill="#007bff" /></svg>';
          // @ts-ignore
          const marker = new gmaps.marker.AdvancedMarkerElement({
            map: mapRef.current,
            position: userLocation,
            content: iconImage,
          });
          setUserMarker(marker);
        } else {
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
