import { Hole } from "model/Hole";
import { Lie } from "model/Lie";
import { PenaltyReason, ReliefMethod } from "model/Penalty";
import { PosOptionMethods } from "model/PosOptions";
import { Stroke } from "model/Stroke";
import { newStrokeFromStrokes } from "./newStrokeFromStrokes";

const teePos = { lat: -37.7, lng: 144.9, alt: 40 };
const waterPos = { lat: -37.71, lng: 144.91, alt: 40 };

function hole(strokes: Stroke[]): Hole {
  return {
    holeNum: 1,
    tees: { default: { par: 4, nominalDistance: 300, pos: teePos } },
    pins: { pin: { lat: -37.72, lng: 144.92, alt: 40 } },
    strokes,
    teePlayed: "default",
    pinPlayed: "pin",
    completed: false,
  };
}

function teeShot(overrides: Partial<Stroke> = {}): Stroke {
  return {
    club: undefined,
    fromPos: teePos,
    fromPosSetMethod: PosOptionMethods.TEE,
    fromLie: Lie.TEE_HIGH,
    toPos: waterPos,
    toPosSetMethod: PosOptionMethods.GPS,
    toLie: Lie.WATER,
    strokeType: undefined,
    strike: undefined,
    intendedPos: undefined,
    ...overrides,
  };
}

describe("usecases/newStrokeFromStrokes", () => {
  test("Starts the first stroke at the tee", () => {
    const stroke = newStrokeFromStrokes([], hole([]));

    expect(stroke.fromPos).toEqual(teePos);
    expect(stroke.fromPosSetMethod).toBe(PosOptionMethods.TEE);
  });

  test("Replays a stroke-and-distance penalty from the previous spot", () => {
    const played = teeShot({
      penalty: {
        reason: PenaltyReason.OUT_OF_BOUNDS,
        strokes: 1,
        relief: ReliefMethod.REPLAY,
      },
    });

    const stroke = newStrokeFromStrokes([played], hole([played]));

    expect(stroke.fromPos).toEqual(teePos);
    expect(stroke.fromPosSetMethod).toBe(PosOptionMethods.REPLAY);
    // back on the tee, so the tee lie carries over rather than the water
    expect(stroke.fromLie).toBe(Lie.TEE_HIGH);
  });

  test("Leaves a drop without a position for the player to set", () => {
    const played = teeShot({
      penalty: {
        reason: PenaltyReason.PENALTY_AREA,
        strokes: 1,
        relief: ReliefMethod.DROP,
      },
    });

    const stroke = newStrokeFromStrokes([played], hole([played]));

    expect(stroke.fromPos).toBeUndefined();
    expect(stroke.fromPosSetMethod).toBe(PosOptionMethods.DROP);
    expect(stroke.fromLie).toBeUndefined();
  });

  test("Plays on from where the ball lies for a score-only penalty", () => {
    const played = teeShot({
      toLie: Lie.BUNKER,
      penalty: { reason: PenaltyReason.GROUNDED_CLUB, strokes: 2 },
    });

    const stroke = newStrokeFromStrokes([played], hole([played]));

    expect(stroke.fromPos).toEqual(waterPos);
    expect(stroke.fromPosSetMethod).toBe(PosOptionMethods.LAST_SHOT);
    expect(stroke.fromLie).toBe(Lie.BUNKER);
  });

  test("Continues from the last shot when no penalty was taken", () => {
    const played = teeShot({ toLie: Lie.FAIRWAY });

    const stroke = newStrokeFromStrokes([played], hole([played]));

    expect(stroke.fromPos).toEqual(waterPos);
    expect(stroke.fromPosSetMethod).toBe(PosOptionMethods.LAST_SHOT);
    expect(stroke.fromLie).toBe(Lie.FAIRWAY);
  });

  test("Still withholds a position for water with no penalty recorded", () => {
    const played = teeShot();

    const stroke = newStrokeFromStrokes([played], hole([played]));

    expect(stroke.fromPos).toBeUndefined();
  });
});
