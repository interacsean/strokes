import { setStrokeLie } from "./setStrokeLie";
import { Club } from "model/Club";
import { StrokeType } from "model/StrokeType";
import { newStrokeFromStrokes } from "usecases/stroke/newStrokeFromStrokes";
import { Lie } from "model/Lie";

describe("setStrokeLie", () => {
  test("When setting Lie as Green, set Putting Putter", () => {
    const expected = {
      lie: Lie.GREEN,
      club: Club.P,
      strokeType: StrokeType.PUTT,
    };

    const stroke = newStrokeFromStrokes([]);
    const actual = setStrokeLie(2, stroke, Lie.GREEN);

    expect(actual).toEqual(expected);
  });
  test("When first stroke, and attempt setting Lie as to non-Tee, revert to Tee", () => {
    const expected = Lie.TEE;

    const stroke = newStrokeFromStrokes([]);
    const actual = setStrokeLie(1, stroke, Lie.FAIRWAY);

    expect(actual.lie).toEqual(expected);
  });
  test("When setting Lie as Fringe, set strokeType Chip", () => {
    const expected = StrokeType.CHIP;

    const stroke = newStrokeFromStrokes([]);
    stroke.club = undefined;
    stroke.strokeType = undefined;
    const actual = setStrokeLie(2, stroke, Lie.FRINGE);

    expect(actual.strokeType).toEqual(expected);
  });
  test("When setting a non-puttable Lie, unset Putting Putter", () => {
    const expected = {
      lie: Lie.BUNKER,
      club: undefined,
      strokeType: undefined,
    };

    const stroke = newStrokeFromStrokes([]);
    stroke.club = Club.P;
    stroke.strokeType = StrokeType.PUTT;
    const actual = setStrokeLie(2, stroke, Lie.BUNKER);

    expect(actual).toEqual(expected);
  });
  test("When setting a puttable Lie, do not unset Putting Putter", () => {
    const expected = { lie: Lie.FRINGE };

    const stroke = newStrokeFromStrokes([]);
    stroke.club = Club.P;
    stroke.strokeType = StrokeType.PUTT;
    const actual = setStrokeLie(2, stroke, Lie.FRINGE);

    expect(actual).toEqual(expected);
  });
});
