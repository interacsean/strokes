import { PenaltyReason, ReliefMethod } from "model/Penalty";
import { setStrokePenalty } from "./setStrokePenalty";

const setStrokeAttr = jest.fn();

beforeEach(() => setStrokeAttr.mockClear());

describe("usecases/setStrokePenalty", () => {
  test("Clears the penalty", () => {
    setStrokePenalty(setStrokeAttr, 1, undefined, undefined);

    expect(setStrokeAttr).toHaveBeenCalledWith({ penalty: undefined });
  });

  test("Keeps a relief the reason allows", () => {
    setStrokePenalty(setStrokeAttr, 1, undefined, {
      reason: PenaltyReason.PENALTY_AREA,
      strokes: 1,
      relief: ReliefMethod.REPLAY,
    });

    expect(setStrokeAttr).toHaveBeenCalledWith({
      penalty: {
        reason: PenaltyReason.PENALTY_AREA,
        strokes: 1,
        relief: ReliefMethod.REPLAY,
      },
    });
  });

  test("Snaps to stroke and distance when the reason forbids a drop", () => {
    setStrokePenalty(setStrokeAttr, 1, undefined, {
      reason: PenaltyReason.OUT_OF_BOUNDS,
      strokes: 1,
      relief: ReliefMethod.DROP,
    });

    expect(setStrokeAttr).toHaveBeenCalledWith({
      penalty: {
        reason: PenaltyReason.OUT_OF_BOUNDS,
        strokes: 1,
        relief: ReliefMethod.REPLAY,
      },
    });
  });

  test("Drops relief entirely for a score-only penalty", () => {
    setStrokePenalty(setStrokeAttr, 1, undefined, {
      reason: PenaltyReason.WRONG_BALL,
      strokes: 2,
      relief: ReliefMethod.DROP,
    });

    expect(setStrokeAttr).toHaveBeenCalledWith({
      penalty: {
        reason: PenaltyReason.WRONG_BALL,
        strokes: 2,
        relief: undefined,
      },
    });
  });
});
