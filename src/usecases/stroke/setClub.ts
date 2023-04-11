import { Club } from "model/Club";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";

export function setClub(
  setHoleAttr: (partStroke: Partial<Stroke>) => void,
  strokeNum: number,
  stroke: Stroke | undefined,
  club: Club | undefined
) {
  const validClub = strokeNum === 1 && club === Club.P ? Club.D : club;

  const attrs: Partial<Stroke> = {
    club: validClub,
  };
  if (validClub === Club.P) {
    attrs.strokeType = StrokeType.PUTT;
  }
  if (validClub !== Club.P && stroke?.strokeType === StrokeType.PUTT) {
    attrs.strokeType = undefined;
  }
  if (validClub && [
    Club.D,
    Club["1W"],
    Club["2W"],
    Club["3W"],
    Club["4W"],
    Club["5W"],
    Club["1H"],
    Club["2H"],
    Club["3H"],
    Club["4H"],
    Club["5H"]
  ]) {
    if (stroke?.strokeType !== StrokeType.FULL) {
      attrs.strokeType = StrokeType.FULL;
    }
  }
  return setHoleAttr(attrs);
}
