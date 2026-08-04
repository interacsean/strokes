import { LatLng } from "model/LatLng";
import { offsetPosition } from "./offsetPosition";
import { calculateDistanceBetweenPositions } from "./calculateDistanceBetweenPositions";
import { calculateBearingBetweenPositions } from "./calculateBearingBetweenPositions";

const origin: LatLng = { lat: -38.544, lng: 146.7169, alt: 12 };

describe("offsetPosition", () => {
  it("lands the requested distance away", () => {
    [0, 45, 137, -100, 359].forEach((bearing) => {
      const moved = offsetPosition(origin, bearing, 150);

      expect(calculateDistanceBetweenPositions(origin, moved)).toBeCloseTo(
        150,
        3
      );
    });
  });

  it("lands on the requested bearing", () => {
    [0, 45, 137, -100].forEach((bearing) => {
      const moved = offsetPosition(origin, bearing, 150);

      expect(calculateBearingBetweenPositions(origin, moved)).toBeCloseTo(
        bearing,
        6
      );
    });
  });

  it("treats zero degrees as north and ninety as east", () => {
    expect(offsetPosition(origin, 0, 100).lat).toBeGreaterThan(origin.lat);
    expect(offsetPosition(origin, 0, 100).lng).toBeCloseTo(origin.lng, 9);
    expect(offsetPosition(origin, 90, 100).lng).toBeGreaterThan(origin.lng);
    expect(offsetPosition(origin, 90, 100).lat).toBeCloseTo(origin.lat, 9);
  });

  it("leaves altitude alone", () => {
    expect(offsetPosition(origin, 30, 100).alt).toBe(12);
  });
});

describe("calculateBearingBetweenPositions", () => {
  it("reads due north as zero and due east as ninety", () => {
    expect(
      calculateBearingBetweenPositions(origin, {
        ...origin,
        lat: origin.lat + 0.001,
      })
    ).toBeCloseTo(0);
    expect(
      calculateBearingBetweenPositions(origin, {
        ...origin,
        lng: origin.lng + 0.001,
      })
    ).toBeCloseTo(90);
  });

  it("reads south as 180 and west as -90", () => {
    expect(
      Math.abs(
        calculateBearingBetweenPositions(origin, {
          ...origin,
          lat: origin.lat - 0.001,
        })
      )
    ).toBeCloseTo(180);
    expect(
      calculateBearingBetweenPositions(origin, {
        ...origin,
        lng: origin.lng - 0.001,
      })
    ).toBeCloseTo(-90);
  });
});
