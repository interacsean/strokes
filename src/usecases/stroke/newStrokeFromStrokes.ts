import { Lie } from "model/Lie";
import { ReliefMethod } from "model/Penalty";
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
  // Relief taken on the last stroke decides where this one starts: replaying is
  // the only case with a position to derive, any drop needs a fresh one.
  const lastRelief = lastStroke?.penalty?.relief;
  let stroke: Stroke = {
    fromPos:
      strokeNum === 1
        ? usedTee?.pos
        : lastRelief === ReliefMethod.REPLAY
        ? lastStroke?.fromPos
        : lastRelief === ReliefMethod.DROP
        ? undefined
        : lastStroke?.toPos &&
          (!lastStroke.toLie ||
            ![Lie.WATER, Lie.HAZARD].includes(lastStroke.toLie))
        ? lastStroke?.toPos
        : undefined,
    fromPosSetMethod:
      strokes.length === 0
        ? usedTee
          ? PosOptionMethods.TEE
          : PosOptionMethods.GPS
        : lastRelief === ReliefMethod.REPLAY
        ? PosOptionMethods.REPLAY
        : lastRelief === ReliefMethod.DROP
        ? PosOptionMethods.DROP
        : PosOptionMethods.LAST_SHOT,
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
    strokeNum === 1
      ? Lie.TEE_HIGH
      : // Where the last stroke finished is only this stroke's lie if the ball
        // was played on from there. Replaying puts it back on the previous lie;
        // a drop puts it somewhere only the player knows.
        lastRelief === ReliefMethod.REPLAY
      ? lastStroke?.fromLie || undefined
      : lastRelief === ReliefMethod.DROP
      ? undefined
      : lastStroke?.toLie || undefined
  );

  setStrokeType(
    ({ strokeType }) => (stroke.strokeType = strokeType),
    strokeNum,
    stroke,
    stroke.strokeType
  );
  return stroke;
}
