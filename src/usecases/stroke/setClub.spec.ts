import { setClub } from "./setClub";
import { StrokeType } from "model/StrokeType";
import { newStrokeFromStrokes } from "usecases/stroke/newStrokeFromStrokes";
import { Club } from "model/Club";
import { Lie } from "model/Lie";

describe("setClub", () => {
  describe("When setting Putter", () => {
    test("set Putt", () => {
      const expected = StrokeType.PUTT;

      const stroke = newStrokeFromStrokes([]);
      const actual = setClub(2, stroke, Club.P);

      expect(actual.strokeType).toEqual(expected);
    });
    test("and lie is rough set Lie to Green", () => {
      const expected = Lie.GREEN;

      const stroke = newStrokeFromStrokes([]);
      stroke.lie = Lie.DEEP_ROUGH;
      const actual = setClub(2, stroke, Club.P);

      expect(actual.lie).toEqual(expected);
    });
    test("and lie is fringe, do not set Lie", () => {
      const stroke = newStrokeFromStrokes([]);
      stroke.lie = Lie.FRINGE;
      const actual = setClub(2, stroke, Club.P);

      expect(actual.lie).toBeUndefined();
    });
    test("and lie is fairway, do not set Lie", () => {
      const stroke = newStrokeFromStrokes([]);
      stroke.lie = Lie.FAIRWAY;
      const actual = setClub(2, stroke, Club.P);

      expect(actual.lie).toBeUndefined();
    });
    test("and lie is light rough, do not set Lie", () => {
      const stroke = newStrokeFromStrokes([]);
      stroke.lie = Lie.LIGHT_ROUGH;
      const actual = setClub(2, stroke, Club.P);

      expect(actual.lie).toBeUndefined();
    });
  });
  describe("When setting club that is not putter", () => {
    test("and stroke is Putt, unset strokeType", () => {
      const stroke = newStrokeFromStrokes([]);
      stroke.strokeType = StrokeType.PUTT;
      const actual = setClub(2, stroke, Club["5I"]);

      expect(actual.strokeType).toBeUndefined();
    });
  });
});
