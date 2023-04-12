import { Club } from "model/Club";
import { Lie, puttableLies } from "model/Lie";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";

export function setStrokeLie(
  strokeNum: number,
  stroke: Stroke | undefined,
  lie: Lie | undefined
) {
  const validLie =
    strokeNum === 1 && (!lie || ![Lie.TEE, Lie.TEE_GRASS].includes(lie))
      ? Lie.TEE
      : lie;
  const attrs: Partial<Stroke> = {
    lie: validLie,
  };
  if (validLie === Lie.GREEN) {
    attrs.club = Club.P;
    attrs.strokeType = StrokeType.PUTT;
  }
  if (validLie === Lie.FRINGE) {
    if (stroke?.club !== Club.P) {
      attrs.strokeType = StrokeType.CHIP;
    }
  }
  if (validLie && !puttableLies.includes(validLie)) {
    if (stroke?.club === Club.P) {
      attrs.club = undefined;
    }
    if (stroke?.strokeType === StrokeType.PUTT) {
      attrs.strokeType = undefined;
    }
  }
  return attrs;
}
