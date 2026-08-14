import { LatLng } from "model/LatLng";
import { calculateMapCamera } from "./calculateMapCamera";
import { calculateDistanceBetweenPositions } from "./calculateDistanceBetweenPositions";
import { calculateBearingBetweenPositions } from "./calculateBearingBetweenPositions";
import { offsetPosition } from "./offsetPosition";

const pin: LatLng = { lat: -37.80525, lng: 145.00922, alt: null };

/** The full screen map: the hole runs up its 812px height, across its 375px. */
const FULL_SCREEN = {
  orientation: "vertical" as const,
  alongHoleMapSize: 100000000,
  acrossHoleMapSize: (100000000 * 375) / 812,
};

const baseInput = {
  ...FULL_SCREEN,
  minAcrossHoleSpan: 18.4,
  tilt: 0,
};

/** Metres of ground the view spans, along the hole and across it. */
function spans(zoom: number) {
  return {
    along: FULL_SCREEN.alongHoleMapSize / Math.pow(2, zoom),
    across: FULL_SCREEN.acrossHoleMapSize / Math.pow(2, zoom),
  };
}

describe("calculateMapCamera", () => {
  it("frames two points end to end, centred between them", () => {
    const ball = offsetPosition(pin, 20, 120);
    const holeBearing = calculateBearingBetweenPositions(ball, pin);

    const camera = calculateMapCamera({
      ...baseInput,
      points: [ball, pin],
      holeBearing,
    });

    expect(camera).not.toBeNull();
    expect(spans(camera!.zoom).along).toBeCloseTo(120 * 1.05, 3);
    expect(calculateDistanceBetweenPositions(camera!.center, ball)).toBeCloseTo(
      60,
      3
    );
    expect(calculateDistanceBetweenPositions(camera!.center, pin)).toBeCloseTo(
      60,
      3
    );
  });

  it("zooms out to take in a ball missed to the side of the hole", () => {
    const onLine = calculateMapCamera({
      ...baseInput,
      points: [offsetPosition(pin, 180, 40), pin],
      holeBearing: 0,
    });
    // 40m short of the pin, but 30m left of the line into it
    const missedLeft = calculateMapCamera({
      ...baseInput,
      points: [offsetPosition(offsetPosition(pin, 180, 40), 270, 30), pin],
      holeBearing: 0,
    });

    expect(missedLeft!.zoom).toBeLessThan(onLine!.zoom);
    expect(spans(missedLeft!.zoom).across).toBeGreaterThanOrEqual(30);
  });

  it("never zooms in past the minimum span across the hole", () => {
    const camera = calculateMapCamera({
      ...baseInput,
      points: [offsetPosition(pin, 0, 2), pin],
      holeBearing: 0,
      minAcrossHoleSpan: 18.4,
    });

    expect(spans(camera!.zoom).across).toBeCloseTo(18.4, 6);
  });

  it("holds a big green's own depth across the hole", () => {
    const camera = calculateMapCamera({
      ...baseInput,
      points: [offsetPosition(pin, 0, 2), pin],
      holeBearing: 0,
      minAcrossHoleSpan: 45,
    });

    expect(spans(camera!.zoom).across).toBeCloseTo(45, 6);
  });

  it("faces up the hole, or across it when the map wants it that way", () => {
    [0, 137, 359].forEach((holeBearing) => {
      const points = [offsetPosition(pin, 180, 100), pin];

      expect(
        calculateMapCamera({ ...baseInput, points, holeBearing })!.heading
      ).toBeCloseTo(holeBearing, 6);
      expect(
        calculateMapCamera({
          ...baseInput,
          points,
          holeBearing,
          orientation: "horizontal",
        })!.heading
      ).toBeCloseTo((holeBearing + 270) % 360, 6);
    });
  });

  it("sizes a horizontal map by the same ground it frames", () => {
    const ball = offsetPosition(pin, 45, 90);
    const holeBearing = calculateBearingBetweenPositions(ball, pin);
    const shared = { ...baseInput, points: [ball, pin], holeBearing };

    // the hole is the same length whichever way round the map holds it
    expect(
      calculateMapCamera({ ...shared, orientation: "horizontal" })!.zoom
    ).toBeCloseTo(calculateMapCamera(shared)!.zoom, 9);
  });

  it("sits back from the middle when the view is tilted", () => {
    const ball = offsetPosition(pin, 0, 100);
    const holeBearing = calculateBearingBetweenPositions(ball, pin);
    const points = [ball, pin];

    const flat = calculateMapCamera({ ...baseInput, points, holeBearing });
    const tilted = calculateMapCamera({
      ...baseInput,
      points,
      holeBearing,
      tilt: 52,
    });

    // back towards the ball by sin(52)/6 of the 100m being framed
    expect(
      calculateDistanceBetweenPositions(flat!.center, tilted!.center)
    ).toBeCloseTo((Math.sin((52 * Math.PI) / 180) / 6) * 100, 3);
    expect(
      calculateDistanceBetweenPositions(tilted!.center, ball)
    ).toBeLessThan(calculateDistanceBetweenPositions(flat!.center, ball));
  });

  it("keeps clear ground around a point that asks for it", () => {
    const ball = offsetPosition(pin, 0, 100);
    const holeBearing = calculateBearingBetweenPositions(ball, pin);

    const camera = calculateMapCamera({
      ...baseInput,
      points: [{ pos: ball, radius: 7 }, pin],
      holeBearing,
    });

    // the 100m to the pin, and 7m of room behind the ball
    expect(spans(camera!.zoom).along).toBeCloseTo(107 * 1.05, 3);
    // half of that room is the only thing between the ball and the edge
    expect(
      spans(camera!.zoom).along / 2 -
        calculateDistanceBetweenPositions(camera!.center, ball)
    ).toBeCloseTo(7 + (107 * 0.05) / 2, 3);
  });

  it("ignores points the course data does not define", () => {
    const ball = offsetPosition(pin, 20, 120);
    const holeBearing = calculateBearingBetweenPositions(ball, pin);

    expect(
      calculateMapCamera({
        ...baseInput,
        points: [ball, pin, undefined, null],
        holeBearing,
      })
    ).toEqual(
      calculateMapCamera({ ...baseInput, points: [ball, pin], holeBearing })
    );
  });

  it("has nothing to frame without any points", () => {
    expect(
      calculateMapCamera({ ...baseInput, points: [null], holeBearing: 0 })
    ).toBeNull();
  });
});
