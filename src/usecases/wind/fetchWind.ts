import { LatLng } from "model/LatLng";
import { Wind, WIND_SPEED_UNIT } from "model/Wind";

const ENDPOINT = "https://api.open-meteo.com/v1/forecast";

/** If the API stops telling us how far apart its timesteps are, assume the
 * quarter-hour grid it currently reports. */
const FALLBACK_INTERVAL_SECONDS = 900;

type CurrentWeatherResponse = {
  current?: {
    /** Local to the requested timezone, which we pin to GMT. */
    time?: string;
    interval?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
  };
};

/** The API returns `2026-09-22T02:30` with no zone marker; we ask for GMT so
 * that reading it as UTC is correct. */
function parseGmtTimestamp(time: string | undefined): number {
  const parsed = time ? Date.parse(`${time}Z`) : NaN;
  return isNaN(parsed) ? Date.now() : parsed;
}

/** Reads the current wind at a position from Open-Meteo. Rejects if the
 * request fails or comes back without a reading. */
export async function fetchWind(pos: LatLng): Promise<Wind> {
  const url = new URL(ENDPOINT);
  url.searchParams.set("latitude", `${pos.lat}`);
  url.searchParams.set("longitude", `${pos.lng}`);
  url.searchParams.set("current", "wind_speed_10m,wind_direction_10m");
  url.searchParams.set("wind_speed_unit", WIND_SPEED_UNIT);
  url.searchParams.set("timezone", "GMT");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Wind request failed: ${response.status}`);
  }

  const body: CurrentWeatherResponse = await response.json();
  const current = body.current;
  if (
    typeof current?.wind_speed_10m !== "number" ||
    typeof current?.wind_direction_10m !== "number"
  ) {
    throw new Error("Wind response had no reading");
  }

  return {
    speed: current.wind_speed_10m,
    fromBearing: current.wind_direction_10m,
    pos,
    observedAt: parseGmtTimestamp(current.time),
    intervalSeconds: current.interval || FALLBACK_INTERVAL_SECONDS,
  };
}
