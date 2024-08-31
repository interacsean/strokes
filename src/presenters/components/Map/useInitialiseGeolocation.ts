import { useEffect } from "react";

const FREQUENCY = 5000; // Update every x/1000 seconds

// Function to handle location permission and retrieval
const handleGetUserLocation = (setUserLocation: any, setGeoLocStatus: any) => {
  if (navigator.geolocation) {
    try {
      setGeoLocStatus(["Requesting geolocation"]);
      navigator.geolocation.getCurrentPosition((pos) => {
        setGeoLocStatus(["Received geolocation"]);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
      // setGeoLocStatus(["Requested geolocation"]);
    } catch (error) {
      setGeoLocStatus(Error("Unhandle error handleGetUserLocation"));
      console.error("Error getting location:", error);
    }
  } else {
    setGeoLocStatus(Error("Unhandle error handleGetUserLocation"));
    console.warn("Geolocation is not supported by this browser.");
  }
};

export function useInitialiseGeolocation(
  setUserLocation: any,
  setGeoLocStatus: any
) {
  useEffect(
    function initialisePositionTracking() {
      handleGetUserLocation(setUserLocation, setGeoLocStatus);

      // Interval for location updates
      const intervalId = setInterval(
        () => handleGetUserLocation(setUserLocation, setGeoLocStatus),
        FREQUENCY
      );

      return () => {
        clearInterval(intervalId); // Cleanup on unmount
      };
    },
    [setGeoLocStatus, setUserLocation]
  );
}
