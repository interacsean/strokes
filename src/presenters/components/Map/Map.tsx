import { useState, useRef, useCallback } from 'react';
import { Button } from '@chakra-ui/react';
import { useInitialiseMap } from './useInitialiseMap';
import { useInitialiseGeolocation } from './useInitialiseGeolocation';
import { useUpdateUserPin } from './useUpdateUserPin';
import { Hole } from 'model/Hole';
import { LatLng } from 'model/LatLng';
import { selectCurrentTeeFromHole } from 'state/course/selectors/currentTee';
import { selectCurrentPinFromHole } from 'state/course/selectors/currentPin';
import { calculateDistanceBetweenPositions } from 'usecases/hole/calculateDistanceBetweenPositions';

type Map = any;

type MapProps = {
  hole: Hole;
  currentPosition: LatLng;
}

function useViewLogic(props: MapProps, map: Map) {
  
  // todo: optimisation
  const teePos = selectCurrentTeeFromHole(props.hole)?.pos;
  const pinPos = selectCurrentPinFromHole(props.hole);

  if (teePos && pinPos && map) {
    const centerLat = (teePos.lat + pinPos.lat) / 2;
    const centerLng = (teePos.lng + pinPos.lng) / 2;
    // @ts-ignore
    const centerPos = new google.maps.LatLng(centerLat, centerLng);

    // Calculate the distance between teePos and pinPos using the provided function
    // const distance = calculateDistanceBetweenPositions(teePos, pinPos);

    // Calculate the map zoom level based on the distance and desired map size
    // const bufferFactor = 1.1; // Adjust this buffer to control how tightly it fits
    // const mapSize = 256; // Size of the map in pixels at zoom level 0
    // const zoomLevel = Math.floor(Math.log2(360 * mapSize / (distance * bufferFactor)));

    // Set the center of the map and the calculated zoom level
    // map.setCenter(centerPos);
    // map.setZoom(zoomLevel);
    // @ts-ignore
    const bounds = new google.maps.LatLngBounds();

    // Extend the bounds to include teePos
    // @ts-ignore
    bounds.extend(new google.maps.LatLng(teePos.lat, teePos.lng));

    // Extend the bounds to include pinPos
    // @ts-ignore
    bounds.extend(new google.maps.LatLng(pinPos.lat, pinPos.lng));
    
    // @ts-ignore
    map.panTo(new google.maps.LatLng(centerLat, centerLng));
    map.setZoom(19);
    console.log('zoom', map.getZoom());
    // @ts-ignore
    // google.maps.event.addListenerOnce(map, 'idle', function() {
    //   map.fitBounds(bounds);
    // });

    // map.fitBounds(bounds, 0);
    // console.log('zoom', map.getZoom());
    map.panToBounds(bounds, 0);
    // console.log('zoom', map.getZoom());
    // setTimeout(() => {
    //   try {
    //   } catch (e) {}
    // }, 1000);

    const latDiff = pinPos.lat - teePos.lat;
    const avgLat = (teePos.lat + pinPos.lat) / 2;
    const lngDiff = (pinPos.lng - teePos.lng) * Math.cos(avgLat * Math.PI / 180); // Adjust lngDiff by cosine of average latitude

    // Calculate the angle in radians
    const angleRad = Math.atan2(lngDiff, latDiff); // Note: reversed latDiff and lngDiff

    // Convert the angle to degrees
    const angleDeg = (angleRad * 180) / Math.PI;

    // Convert to a bearing value where 0 is north and increases clockwise
    const bearingDeg = (angleDeg + 360) % 360; // Ensure the bearing is between 0 and 360 degrees

    // Set the map's bearing (rotation) to the calculated angle
    map.setHeading(bearingDeg);


    // Optionally, you can set the tilt to get a 3D perspective
    map.setTilt(45); // Adjust the tilt as needed

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

function Map(props: MapProps) {
  const [map, setMap] = useState<Map | null>(null);
  const userLocation = props.currentPosition;
  const viewLogic = useViewLogic(props, map);
  // const [userLocation, setUserLocation] = useState<{ lat: number, lng: number} | null>(null);

  const mapRef = useRef<Map | null>(null);  // Ref for map instance

  useInitialiseMap(map, setMap, mapRef);
  useUpdateUserPin(userLocation, map, mapRef);

  // const handleRecenter = useCallback(() => {
  //   if (userLocation && mapRef.current) {
  //     const newCenter = { lat: userLocation.lat, lng: userLocation.lng };
  //     mapRef.current?.setCenter(newCenter); // Update map center only if following
  //   }
  // }, [userLocation]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
      <div style={{ position: 'absolute', left: '0.5rem', bottom: '0.5rem', backgroundColor: '#ffdddd' }}>
        message here
      </div>
      <div style={{ position: 'absolute', right: '0.5rem', bottom: '0.5rem' }}>
        {/* <Button onClick={handleRecenter}>$</Button> */}
      </div>
    </div>
  );
}

export default Map;
