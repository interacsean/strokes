export function metersToLon(meters: number, latitude: number) {
  const earthRadius = 6378137; // Earth's radius in meters
  const radiansPerDegree = Math.PI / 180;
  const latRadians = latitude * radiansPerDegree;

  // Calculate the length of a degree of longitude at the given latitude
  const lonDistance = Math.PI * earthRadius * Math.cos(latRadians) / 180;

  // Convert meters to degrees of longitude
  const lon = meters / lonDistance;

  return lon;
}

export function lonToMeters(lon: number, latitude: number) {
  const earthRadius = 6378137; // Earth's radius in meters
  const radiansPerDegree = Math.PI / 180;
  const latRadians = latitude * radiansPerDegree;

  // Calculate the length of a degree of longitude at the given latitude
  const lonDistance = Math.PI * earthRadius * Math.cos(latRadians) / 180;

  // Convert degrees of longitude to meters
  const meters = lon * lonDistance;

  return meters;
}