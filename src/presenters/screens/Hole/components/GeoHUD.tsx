import { Box, Text } from "@chakra-ui/react";

export function GeoHUD(props: any) {
  return (
    <Box>
      <Text>isGeoAvail: {props.geo.isGeolocationAvailable ? "T" : "F"}</Text>
      <Text>isGeoEnabled: {props.geo.isGeolocationEnabled ? "T" : "F"}</Text>
      <Text>lat: {props.currentPosition?.lat}</Text>
      <Text>lng: {props.currentPosition?.lng}</Text>
      <Text>alt: {props.currentPosition?.alt}</Text>
      <Text>geo.timestamp: {props.geo?.timestamp}</Text>
      <Text>coords.accuracy: {JSON.stringify(props.geo.coords?.accuracy)}</Text>
    </Box>
  );
}
