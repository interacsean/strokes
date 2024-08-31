import { useEffect } from "react";

const DEFAULT_LOCATION = { lat: 37.7749, lng: -122.4194 }; // San Francisco (replace with your desired location)
const DEFAULT_ZOOM = 13;

export function useInitialiseMap(map: any, setMap: any, mapRef: any) {
  // @ts-ignore - todo: fix window
  const gmaps = window.google?.maps; // Assuming you have a Maps Maps API script loaded with your API key

  useEffect(function initialiseMap() {
    (async () => {
      if (!map) {
        const { Map: _Map } = await gmaps.importLibrary("maps");
        const { AdvancedMarkerElement: _AME } = await gmaps.importLibrary("marker");
  
        const mapElement = document.getElementById('map');
        const mapOptions = {
          zoom: DEFAULT_ZOOM,
          center: DEFAULT_LOCATION,
          disableDefaultUI: true, // Hides most default controls
          mapTypeControl: false, // Hides Map | Satellite toggle
          fullscreenControl: false, // Hides fullscreen button
          streetViewControl: false, // Hides Streetview button
          myLocationButtonControl: true,
          // @ts-ignore
          mapTypeId: google.maps.MapTypeId.SATELLITE,
          // styles: googleMapStyle,
          mapId: '91eaa2523d3531c5',
        };
  
        const newMap = new gmaps.Map(mapElement, mapOptions);
        setMap(newMap);
        mapRef.current = newMap;
      }
    })();
  }, [gmaps, map, mapRef, setMap]);
}