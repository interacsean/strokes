import { Club } from "model/Club";
import { Lie } from "model/Lie";
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
    if (stroke && !stroke.fromLie) attrs.fromLie = Lie.GREEN;
    if (stroke && !stroke.toLie) attrs.toLie = Lie.GREEN;
  }
  if (validClub !== Club.P && stroke?.strokeType === StrokeType.PUTT) {
    attrs.strokeType = undefined;
  }
  if (
    validClub && [
      Club.D,
      Club["2W"],
      Club["3W"],
      Club["4W"],
      Club["5W"],
      Club["7W"],
      Club["9W"],
      Club["1H"],
      Club["2H"],
      Club["3H"],
      Club["4H"],
      Club["5H"],
      Club["2I"],
      Club["3I"],
      Club["4I"],
      Club["5I"],
      Club["6I"],
      Club["7I"],
      Club["8I"],
      Club["9I"],
    ]
  ) {
    if (stroke?.strokeType === undefined) {
      attrs.strokeType = StrokeType.FULL;
    }
  }
  return setHoleAttr(attrs);
}
