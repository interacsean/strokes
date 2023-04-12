import { Club } from "model/Club";
import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";

export function setStrokeType(
  strokeNum: number,
  curStroke: Stroke | undefined,
  strokeType: StrokeType | undefined
) {
  const { lie, club } = curStroke || {};
  const validStrokeType =
    strokeNum === 1 && strokeType === StrokeType.PUTT
      ? StrokeType.FULL
      : strokeType;

  const attrs: Partial<Stroke> = {
    strokeType: validStrokeType,
  };
  if (validStrokeType !== StrokeType.PUTT) {
    if (lie === Lie.GREEN) {
      attrs.lie = undefined;
    }
    if (club === Club.P) {
      attrs.club = undefined;
    }
  }
  if (validStrokeType === StrokeType.PUTT) {
    attrs.club = Club.P;
    if (!lie || ![Lie.GREEN, Lie.FRINGE].includes(lie)) {
      attrs.lie = Lie.GREEN;
    }
  }

  return attrs;
}
