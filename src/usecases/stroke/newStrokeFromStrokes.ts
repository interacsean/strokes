import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";
import { last } from "ramda";
import { setStrokeFromLie } from "./setStrokeFromLie";
import { setStrokeType } from "./setStrokeType";
import { Hole } from "model/Hole";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";

export function newStrokeFromStrokes(strokes: Stroke[], hole: Hole): Stroke {
  const lastStroke = last(strokes);
  let stroke: Stroke = {
    fromLie: undefined,
    fromPos: undefined,
    club: undefined,
    intendedPos: undefined,
    toPos: undefined,
    toLie: undefined,
    strokeType: StrokeType.FULL,
  };
  const strokeNum = strokes.length + 1;
  setStrokeFromLie(
    ({ fromLie }) => (stroke.fromLie = fromLie),
    strokeNum,
    stroke,
    strokeNum === 1
      ? Lie.TEE
      : lastStroke?.fromLie === Lie.GREEN
      ? Lie.GREEN
      : undefined
  );
  if (lastStroke) {
    stroke.fromPos = lastStroke?.toPos;
  } else {
    const usedTee = selectCurrentTeeFromHole(hole);
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
