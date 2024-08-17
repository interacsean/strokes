import { Club } from "model/Club";
import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";

export function setStrokeType(
  setHoleAttr: (partStroke: Partial<Stroke>) => void,
  strokeNum: number,
  curStroke: Stroke | undefined,
  strokeType: StrokeType | undefined
) {
  const { fromLie, club } = curStroke || {};
  const validStrokeType =
    strokeNum === 1 && strokeType === StrokeType.PUTT
      ? StrokeType.FULL
      : strokeType;

  const attrs: Partial<Stroke> = {
    strokeType: validStrokeType,
  };
  if (validStrokeType !== StrokeType.PUTT) {
    if (fromLie === Lie.GREEN) {
      attrs.fromLie = undefined;
    }
    if (club === Club.P) {
      attrs.club = undefined;
    }
  }
  if (validStrokeType === StrokeType.PUTT) {
    attrs.club = Club.P;
    if (!fromLie || !([Lie.GREEN, Lie.FRINGE] as string[]).includes(fromLie)) {
      attrs.fromLie = Lie.GREEN;
    }
  }

  return setHoleAttr(attrs);
}
