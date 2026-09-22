import { Wind } from "model/Wind";
import { LatLng } from "model/LatLng";
import { metersToLat } from "presenters/utils/metersToLongitude";
import {
  shouldRefetchWind,
  nextWindDueAt,
  WIND_RETRY_MS,
} from "./shouldRefetchWind";

const POS: LatLng = { lat: -37.8136, lng: 144.9631, alt: null };
const OBSERVED_AT = Date.parse("2026-09-22T02:30:00Z");

const wind: Wind = {
  speed: 11.4,
  fromBearing: 176,
  pos: POS,
  observedAt: OBSERVED_AT,
  intervalSeconds: 900,
};

const northOf = (metres: number): LatLng => ({
  ...POS,
  lat: POS.lat + metersToLat(metres),
});

const fresh = {
  wind,
  pos: POS,
  lastAttemptAt: null,
  lastAttemptFailed: false,
  now: OBSERVED_AT + 60_000,
};

describe("shouldRefetchWind", () => {
  it("fetches when there is no reading yet", () => {
    expect(shouldRefetchWind({ ...fresh, wind: null })).toBe(true);
  });

  it("does not fetch without a position", () => {
    expect(shouldRefetchWind({ ...fresh, wind: null, pos: null })).toBe(false);
  });

  it("holds a reading until the next timestep falls due", () => {
    expect(
      shouldRefetchWind({ ...fresh, now: nextWindDueAt(wind) - 1000 })
    ).toBe(false);
    expect(shouldRefetchWind({ ...fresh, now: nextWindDueAt(wind) })).toBe(
      true
    );
  });

  it("holds the reading over a short walk", () => {
    expect(shouldRefetchWind({ ...fresh, pos: northOf(90) })).toBe(false);
  });

  it("fetches again once we have moved more than 100m", () => {
    expect(shouldRefetchWind({ ...fresh, pos: northOf(110) })).toBe(true);
  });

  it("backs off after a failure, then tries again", () => {
    const failed = {
      ...fresh,
      wind: null,
      lastAttemptFailed: true,
      lastAttemptAt: fresh.now,
    };
    expect(shouldRefetchWind(failed)).toBe(false);
    expect(
      shouldRefetchWind({ ...failed, now: fresh.now + WIND_RETRY_MS })
    ).toBe(true);
  });
});
