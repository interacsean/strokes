import { Club } from "model/Club";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";
import { Lie, puttableLies } from "model/Lie";

export function setClub(
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
    if (stroke?.lie && !puttableLies.includes(stroke.lie)) {
      attrs.lie = Lie.GREEN;
    }
  }
  if (validClub !== Club.P && stroke?.strokeType === StrokeType.PUTT) {
    attrs.strokeType = undefined;
  }
  return attrs;
}
