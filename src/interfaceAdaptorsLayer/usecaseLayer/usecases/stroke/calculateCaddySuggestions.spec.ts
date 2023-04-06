import {
  CaddySuggestion,
  calculateCaddySuggestions,
} from "./calculateCaddySuggestions";
import { Club } from "model/Club";

const testClubStats = {
  [Club.D]: { loft: 9, distances: [200, 220] as [number, number] },
  [Club["3W"]]: { loft: 15, distances: [170, 190] as [number, number] },
  [Club["5W"]]: { loft: 21, distances: [165, 185] as [number, number] },
  [Club["4I"]]: { loft: 23, distances: [140, 155] as [number, number] },
};

describe("calculateCaddySuggestions", () => {
  test("Suggest clubs appropriate for distance", () => {
    const expected: CaddySuggestion[] = [
      { club: Club["5W"], clubDistance: [165, 185] },
      { club: Club["3W"], clubDistance: [170, 190] },
    ];

    // Distance delta is 171m
    const holePos = { lat: -37, lng: 144, alt: null };
    const ballPos = { lat: -37.0012, lng: 144.0012, alt: null };

    const actual = calculateCaddySuggestions(
      { holePos },
      {
        ballPos,
        intendedPos: undefined,
      },
      testClubStats
    );

    expect(actual).toEqual(expected);
  });
});
