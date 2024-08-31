import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";
import { last } from "ramda";
import { setStrokeFromLie } from "./setStrokeFromLie";
import { setStrokeType } from "./setStrokeType";
import { Hole } from "model/Hole";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";
import { PosOptionMethods } from "model/PosOptions";

export function newStrokeFromStrokes(strokes: Stroke[], hole: Hole): Stroke {
  const lastStroke = last(strokes);
  const usedTee = selectCurrentTeeFromHole(hole);
  const strokeNum = strokes.length + 1;
  let stroke: Stroke = {
    fromPos:
      strokeNum === 1
        ? usedTee?.pos
        : lastStroke?.toPos &&
          (!lastStroke.toLie ||
            ![Lie.WATER, Lie.HAZARD].includes(lastStroke.toLie))
        ? lastStroke?.toPos
        : undefined,
    fromPosSetMethod:
      strokes.length > 0
        ? PosOptionMethods.LAST_SHOT
        : usedTee
        ? PosOptionMethods.TEE
        : PosOptionMethods.GPS,
    fromLie: undefined,
    club: undefined,
    intendedPos: undefined,
    toPos: undefined,
    toPosSetMethod: PosOptionMethods.GPS,
    toLie:
      lastStroke?.toLie && [Lie.GREEN, Lie.FRINGE].includes(lastStroke.toLie)
        ? Lie.GREEN
        : undefined,
    strokeType: StrokeType.FULL,
  };
  setStrokeFromLie(
    ({ fromLie, club, strokeType }) => {
      if (fromLie) stroke.fromLie = fromLie;
      if (club) stroke.club = club;
      if (strokeType) stroke.strokeType = strokeType;
    },
    strokeNum,
    stroke,
    strokeNum === 1 ? Lie.TEE_HIGH : lastStroke?.toLie || undefined
  );

  setStrokeType(
    ({ strokeType }) => (stroke.strokeType = strokeType),
    strokeNum,
    stroke,
    stroke.strokeType
  );
  return stroke;
}
