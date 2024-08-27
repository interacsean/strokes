import { useEffect, useState } from "react";

export function useUpdateUserPin(userLocation: any, followUser: any, map: any, mapRef: any) {
  // @ts-ignore - todo: fix window
  const gmaps = window.google?.maps; // Assuming you have a Maps Maps API script loaded with your API key

  const [userMarker, setUserMarker] = useState(null);

  useEffect(function updateUserPosition() {
    if (userLocation && map && gmaps?.marker?.AdvancedMarkerElement) {
      if (!userMarker) {

        const iconImage = document.createElement("img");
        iconImage.src =  
        // "https://developers.google.com/maps/documentation/javascript/examples/full/images/parking_lot_maps.png";
         'data:image/svg+xml;charset=utf-8,<svg width="20" height="20"><circle cx="10" cy="10" r="8" fill="#007bff" /></svg>';
        const marker = new gmaps.marker.AdvancedMarkerElement({
          map: mapRef.current,
          position: userLocation,
          content: iconImage,
        })
        // const marker = new window.gmaps.Marker({
        //   position: userLocation,
        //   map: mapRef,
        //   icon: {
        //   url: 'data:image/svg+xml;charset=utf-8,<svg width="20" height="20"><circle cx="10" cy="10" r="8" fill="#007bff" /></svg>',
        //     scaledSize: new gmaps.Size(20, 20),
        //     anchor: new gmaps.Point(10, 10), // Adjust anchor point as needed
        //   },          
        // });

        // Add the marker to the map (assuming mapRef.current is your map instance)
        // mapRef.current.overlayView.addOverlay(newMarker);

        // Optional: Clean up previous marker (if needed)
        // if (userMarker) {
        //   mapRef.current.overlayView.removeOverlay(userMarker);
        // }

        setUserMarker(marker);

        // setUserMarker(marker);
      } else {
        // Update existing marker position
        // userMarker.setPosition(userLocation);
      }
    }
    if (userLocation && followUser && mapRef.current) {
      const newCenter = { lat: userLocation.lat, lng: userLocation.lng };
      mapRef.current?.setCenter(newCenter); // Update map center only if following
    }
  }, [gmaps?.marker?.AdvancedMarkerElement, userLocation, map, mapRef, userMarker, followUser]);
}