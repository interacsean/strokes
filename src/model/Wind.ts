import { LatLng } from "./LatLng";

/** Wind speeds are read off the map at a glance, so they are fetched and shown
 * in one unit throughout rather than converted at the edges. */
export const WIND_SPEED_UNIT = "mph";

export type Wind = {
  /** Wind speed at 10m, in WIND_SPEED_UNIT. */
  speed: number;
  /** Where the wind is blowing *from*, degrees clockwise from north — the
   * meteorological convention the API reports in. A southerly (180) pushes the
   * ball towards the north. */
  fromBearing: number;
  /** The position the reading was fetched for. */
  pos: LatLng;
  /** Epoch ms of the timestep the reading belongs to, per the API's
   * `current.time` — not when we asked for it. */
  observedAt: number;
  /** Seconds between the API's timesteps, per `current.interval`. The reading
   * cannot change before the next one falls due. */
  intervalSeconds: number;
};
