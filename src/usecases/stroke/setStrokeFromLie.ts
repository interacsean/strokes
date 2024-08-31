import { Club } from "model/Club";
import { Lie, PuttableLies, TeeLies } from "model/Lie";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";

export function setStrokeFromLie(
  setHoleAttr: (partStroke: Partial<Stroke>) => void,
  strokeNum: number,
  stroke: Stroke | undefined,
  lie: Lie | string | undefined
) {
  const validLie =
    strokeNum === 1 && (!lie || !(TeeLies as string[]).includes(lie))
      ? Lie.TEE_HIGH
      : strokeNum > 1 && lie && (TeeLies as string[]).includes(lie)
      ? undefined
      : lie;
  const attrs: Partial<Stroke> = {
    fromLie: validLie,
  };
  if (validLie === Lie.GREEN) {
    if (stroke?.club === undefined) {
      attrs.club = Club.P;
      attrs.strokeType = StrokeType.PUTT;
    }
  } else if (validLie === Lie.FRINGE) {
    if (stroke?.club === undefined) {
      attrs.club = Club.P;
      if ([undefined, StrokeType.FULL].includes(stroke?.strokeType)) {
        attrs.strokeType = StrokeType.PUTT;
      }
    }
  } else if (validLie === Lie.BUNKER) {
    if (stroke?.club === undefined) {
      attrs.club = Club.SW;
      if (stroke?.strokeType === undefined) {
        attrs.strokeType = StrokeType.FLOP;
      }
    }
  }
  if (validLie && !(PuttableLies as string[]).includes(validLie)) {
    if (stroke?.club === Club.P) {
      attrs.club = undefined;
    }
    if (stroke?.strokeType === StrokeType.PUTT) {
      attrs.strokeType = undefined;
    }
  }
  return setHoleAttr(attrs);
}
