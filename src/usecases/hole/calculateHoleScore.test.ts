import { Hole } from "model/Hole";
import { Penalty, PenaltyReason, ReliefMethod } from "model/Penalty";
import { Stroke } from "model/Stroke";
import { calculateHoleScore, countPenaltyStrokes } from "./calculateHoleScore";

function stroke(penalty?: Penalty): Stroke {
  return {
    club: undefined,
    fromPos: undefined,
    fromPosSetMethod: undefined as never,
    fromLie: undefined,
    toPos: undefined,
    toPosSetMethod: undefined as never,
    toLie: undefined,
    strokeType: undefined,
    strike: undefined,
    intendedPos: undefined,
    ...(penalty ? { penalty } : {}),
  };
}

function hole(strokes: Stroke[]): Hole {
  return {
    holeNum: 1,
    tees: {},
    pins: {},
    strokes,
    teePlayed: undefined,
    pinPlayed: undefined,
    completed: false,
  };
}

describe("usecases/calculateHoleScore", () => {
  test("Counts swings when there are no penalties", () => {
    expect(calculateHoleScore(hole([stroke(), stroke(), stroke()]))).toBe(3);
  });

  test("Adds a one-stroke penalty to the swing count", () => {
    const penalty = {
      reason: PenaltyReason.PENALTY_AREA,
      strokes: 1,
      relief: ReliefMethod.DROP,
    };

    expect(calculateHoleScore(hole([stroke(penalty), stroke()]))).toBe(3);
  });

  test("Adds two-stroke penalties", () => {
    const penalty = { reason: PenaltyReason.WRONG_BALL, strokes: 2 };

    expect(calculateHoleScore(hole([stroke(), stroke(penalty)]))).toBe(4);
  });

  test("Sums penalties across strokes", () => {
    const water = {
      reason: PenaltyReason.PENALTY_AREA,
      strokes: 1,
      relief: ReliefMethod.DROP,
    };
    const oob = {
      reason: PenaltyReason.OUT_OF_BOUNDS,
      strokes: 1,
      relief: ReliefMethod.REPLAY,
    };

    expect(countPenaltyStrokes([stroke(water), stroke(), stroke(oob)])).toBe(2);
    expect(calculateHoleScore(hole([stroke(water), stroke(), stroke(oob)]))).toBe(5);
  });

  test("Treats rounds saved without penalties as penalty-free", () => {
    expect(countPenaltyStrokes([stroke(), stroke()])).toBe(0);
  });

  test("Scores an empty hole as zero", () => {
    expect(calculateHoleScore(hole([]))).toBe(0);
  });
});
