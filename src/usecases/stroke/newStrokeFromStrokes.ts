import { Lie } from "model/Lie";
import { Strike } from "model/Strike";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";
import { last } from "ramda";
import { setStrokeFromLie } from "./setStrokeFromLie";
import { setStrokeType } from "./setStrokeType";
import { Hole } from "model/Hole";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";
import { PosOptionMethods } from "model/PosOptions";
import { Club } from "model/Club";

export function newStrokeFromStrokes(strokes: Stroke[], hole: Hole): Stroke {
  const lastStroke = last(strokes);
  const usedTee = selectCurrentTeeFromHole(hole);
  const nominalDistance = usedTee?.nominalDistance;
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
    // todo: Make based on stats
    club:
      strokeNum === 1 && nominalDistance && nominalDistance > 220
        ? Club.D
        : undefined,
    intendedPos: undefined,
    toPos: undefined,
    toPosSetMethod: PosOptionMethods.GPS,
    toLie:
      lastStroke?.toLie && [Lie.GREEN, Lie.FRINGE].includes(lastStroke.toLie)
        ? Lie.GREEN
        : undefined,
    strokeType: StrokeType.FULL,
    strike: Strike.Clean,
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
