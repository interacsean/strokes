import { Club } from "model/Club";
import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";

export function setClub(
  setHoleAttr: (partStroke: Partial<Stroke>) => void,
  strokeNum: number,
  stroke: Stroke,
  club: Club | undefined
) {
  const validClub = strokeNum === 1 && club === Club.P ? Club.D : club;

  const attrs: Partial<Stroke> = {
    club: validClub,
  };
  if (validClub === Club.P) {
    attrs.strokeType = StrokeType.PUTT;
  }
  if (validClub !== Club.P && stroke.strokeType === StrokeType.PUTT) {
    attrs.strokeType = undefined;
  }
  return setHoleAttr(attrs);
}
