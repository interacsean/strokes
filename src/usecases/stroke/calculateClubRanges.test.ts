import { Club } from "model/Club";
import { ClubStats } from "model/ClubStats";
import { StrokeType } from "model/StrokeType";
import { calculateClubRanges } from "./calculateClubRanges";

const stats = (
  overrides: Partial<{
    medianDistance: number;
    roll: number;
    sd1Distances: [number, number];
  }>
): ClubStats => ({
  [Club.D]: {
    [StrokeType.FULL]: {
      medianDistance: 185,
      roll: 25,
      sd1Distances: [180, 205],
      sd2Distances: [155, 215],
      sd1Side: [3, 17],
      sd2Side: [10, 25],
      strikeQuality: {},
      ...overrides,
    },
  },
});

describe("calculateClubRanges", () => {
  it("reads total from the recorded distances", () => {
    const ranges = calculateClubRanges({}, Club.D, StrokeType.FULL);
    expect(ranges).toBeNull();

    expect(
      calculateClubRanges(stats({}), Club.D, StrokeType.FULL)?.total
    ).toEqual({ low: 180, mid: 185, high: 205 });
  });

  it("backs carry off the total by the club's roll", () => {
    expect(
      calculateClubRanges(stats({}), Club.D, StrokeType.FULL)?.carry
    ).toEqual({ low: 155, mid: 160, high: 180 });
  });

  it("assumes ten metres of roll when the club records none", () => {
    expect(
      calculateClubRanges(stats({ roll: 0 }), Club.D, StrokeType.FULL)?.carry
    ).toEqual({ low: 170, mid: 175, high: 195 });
  });

  it("has nothing to draw without a club or a stroke type", () => {
    expect(
      calculateClubRanges(stats({}), undefined, StrokeType.FULL)
    ).toBeNull();
    expect(calculateClubRanges(stats({}), Club.D, undefined)).toBeNull();
  });

  it("has nothing to draw for a stroke type the club has no stats for", () => {
    expect(calculateClubRanges(stats({}), Club.D, StrokeType.PUTT)).toBeNull();
  });

  it("has nothing to draw when the distances are not real distances", () => {
    expect(
      calculateClubRanges(
        stats({ medianDistance: 0, sd1Distances: [0, 0] }),
        Club.D,
        StrokeType.FULL
      )
    ).toBeNull();
  });

  it("has nothing to draw when roll would swallow the carry", () => {
    expect(
      calculateClubRanges(
        stats({ medianDistance: 20, roll: 25, sd1Distances: [18, 24] }),
        Club.D,
        StrokeType.FULL
      )
    ).toBeNull();
  });
});
