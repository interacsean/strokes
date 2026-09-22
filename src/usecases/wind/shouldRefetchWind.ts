import { LatLng } from "model/LatLng";
import { Wind } from "model/Wind";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";

/** A round is walked in small steps, and the wind a few holes away is the same
 * wind. Only a move of about a hole's length is worth another reading. */
export const WIND_REFETCH_DISTANCE_METRES = 100;

/** The API tells us the timestep its reading belongs to and how long a timestep
 * lasts, so we can wait until the next one is actually due instead of asking on
 * a guessed cadence. This is the slack we allow for it to publish that one. */
const NEXT_TIMESTEP_GRACE_MS = 30_000;

/** If a request fails we leave it this long before trying again, rather than
 * hammering the API from a component that re-renders on every GPS tick. */
export const WIND_RETRY_MS = 60_000;

export type WindFreshnessInput = {
  /** The reading in hand, if any. */
  wind: Wind | null;
  /** Where we are now. */
  pos: LatLng | null | undefined;
  /** When the last request was made, successful or not. */
  lastAttemptAt: number | null;
  /** Whether that last request failed. */
  lastAttemptFailed: boolean;
  now: number;
};

/** When the API's next reading falls due — the timestep the one in hand belongs
 * to, plus a timestep, plus slack for it to be published. */
export function nextWindDueAt(wind: Wind): number {
  return wind.observedAt + wind.intervalSeconds * 1000 + NEXT_TIMESTEP_GRACE_MS;
}

/**
 * Whether to ask for the wind again. Nothing changes between the API's
 * timesteps, so a reading in hand holds until the next one falls due — unless
 * we have walked far enough that it is a different bit of weather.
 */
export function shouldRefetchWind({
  wind,
  pos,
  lastAttemptAt,
  lastAttemptFailed,
  now,
}: WindFreshnessInput): boolean {
  if (!pos) return false;

  // Back off after a failure, whatever else is true.
  if (
    lastAttemptFailed &&
    lastAttemptAt !== null &&
    now - lastAttemptAt < WIND_RETRY_MS
  ) {
    return false;
  }

  if (!wind) return true;

  const movedFar =
    calculateDistanceBetweenPositions(wind.pos, pos) >
    WIND_REFETCH_DISTANCE_METRES;

  return movedFar || now >= nextWindDueAt(wind);
}
