import { useState, useRef, useCallback } from 'react';
import { Button } from '@chakra-ui/react';
import { useInitialiseMap } from './useInitialiseMap';
import { useInitialiseGeolocation } from './useInitialiseGeolocation';
import { useUpdateUserPin } from './useUpdateUserPin';

type Map = any;

function Map() {
  const [map, setMap] = useState<Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number} | null>(null);
  const [geoLocStatus, setGeoLocStatus] = useState<Error | string[]>([]);
  const [followUser, setFollowUser] = useState(true);

  const mapRef = useRef<Map | null>(null);  // Ref for map instance

  useInitialiseMap(map, setMap, setFollowUser, mapRef);
  useInitialiseGeolocation(setUserLocation, setGeoLocStatus);
  useUpdateUserPin(userLocation, followUser, map, mapRef);

  const handleRecenter = useCallback(() => {
    setFollowUser(true);
    if (userLocation && mapRef.current) {
      const newCenter = { lat: userLocation.lat, lng: userLocation.lng };
      mapRef.current?.setCenter(newCenter); // Update map center only if following
    }
  }, [userLocation]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
      <div style={{ position: 'absolute', left: '0.5rem', bottom: '0.5rem', backgroundColor: '#ffdddd' }}>
        {geoLocStatus instanceof Error ? geoLocStatus.message : geoLocStatus?.[0]}
      </div>
      <div style={{ position: 'absolute', right: '0.5rem', bottom: '0.5rem' }}>
        <Button onClick={handleRecenter}>$</Button>
      </div>
    </div>
  );
}

export default Map;
