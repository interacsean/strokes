import { Club } from "model/Club";
import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";

export function setStrokeLie(
  setHoleAttr: (partStroke: Partial<Stroke>) => void,
  strokeNum: number,
  stroke: Stroke | undefined,
  lie: Lie | undefined
) {
  const validLie =
    strokeNum === 1 && (!lie || ![Lie.TEE, Lie.TEE_GRASS].includes(lie))
      ? Lie.TEE
      : strokeNum > 1 && lie === Lie.TEE
      ? Lie.FAIRWAY
      : lie;
  const attrs: Partial<Stroke> = {
    lie: validLie,
  };
  if (validLie === Lie.GREEN) {
    attrs.club = Club.P;
    attrs.strokeType = StrokeType.PUTT;
  }
  if (validLie === Lie.FRINGE) {
    if (stroke?.club === undefined) {
      attrs.club = Club.PW;
      if (stroke?.strokeType === undefined) {
        attrs.strokeType = StrokeType.CHIP;
      }
    }
  }
  if (
    validLie &&
    ![Lie.FRINGE, Lie.GREEN, Lie.FAIRWAY, Lie.LIGHT_ROUGH].includes(validLie)
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
