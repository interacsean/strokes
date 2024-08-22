import { Club } from "model/Club";
import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";

export function setStrokeFromLie(
  setHoleAttr: (partStroke: Partial<Stroke>) => void,
  strokeNum: number,
  stroke: Stroke | undefined,
  lie: Lie | string | undefined
) {
  const validLie =
    strokeNum === 1 &&
    (!lie ||
      !(
        [Lie.TEE_HIGH, Lie.TEE_MEDIUM, Lie.TEE_LOW, Lie.TEE_GRASS] as string[]
      ).includes(lie))
      ? Lie.TEE_HIGH
      : strokeNum > 1 && lie === Lie.TEE_HIGH
      ? Lie.FAIRWAY
      : lie;
  const attrs: Partial<Stroke> = {
    fromLie: validLie,
  };
  if (validLie === Lie.GREEN) {
    attrs.club = Club.P;
    attrs.strokeType = StrokeType.PUTT;
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
  if (
    validLie &&
    !(
      [Lie.FRINGE, Lie.GREEN, Lie.FAIRWAY, Lie.LIGHT_ROUGH] as string[]
    ).includes(validLie)
  ) {
    if (stroke?.club === Club.P) {
      attrs.club = undefined;
    }
    if (stroke?.strokeType === StrokeType.PUTT) {
      attrs.strokeType = undefined;
    }
  }
  return setHoleAttr(attrs);
}
