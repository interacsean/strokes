import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";
import { last } from "ramda";
import { setStrokeFromLie } from "./setStrokeFromLie";
import { setStrokeType } from "./setStrokeType";
import { Hole } from "model/Hole";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";
import { PosOptionMethods } from "model/PosOptions";
import { setClub } from "./setClub";

export function newStrokeFromStrokes(strokes: Stroke[], hole: Hole): Stroke {
  const lastStroke = last(strokes);
  const usedTee = selectCurrentTeeFromHole(hole);
  let stroke: Stroke = {
    fromPos: undefined,
    fromPosSetMethod:
      strokes.length > 0 ? PosOptionMethods.LAST_SHOT
        : usedTee ? PosOptionMethods.TEE
        : PosOptionMethods.GPS,
    fromLie: undefined,
    club: undefined,
    intendedPos: undefined,
    toPos: undefined,
    toPosSetMethod: PosOptionMethods.GPS,
    toLie: undefined,
    strokeType: StrokeType.FULL,
  };
  const strokeNum = strokes.length + 1;
  setStrokeFromLie(
    ({ fromLie, club, strokeType }) => {
      if (fromLie) stroke.fromLie = fromLie;
      if (lastStroke && lastStroke.toLie === Lie.GREEN) stroke.toLie = Lie.GREEN;
      if (club) stroke.club = club;
      if (strokeType) stroke.strokeType = strokeType;
    },
    strokeNum,
    stroke,
    strokeNum === 1 ? Lie.TEE_HIGH : lastStroke?.toLie || undefined
  );

  if (lastStroke) {
    stroke.fromPos = lastStroke?.toPos;
  } else {
    if (usedTee) stroke.fromPos = usedTee.pos;
  }
  setStrokeType(
    ({ strokeType }) => (stroke.strokeType = strokeType),
    strokeNum,
    stroke,
    stroke.strokeType
  );
  return stroke;
}
