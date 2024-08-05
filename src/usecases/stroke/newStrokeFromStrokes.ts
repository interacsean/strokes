import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";
import { last } from "ramda";
import { setStrokeLie } from "./setStrokeLie";
import { setStrokeType } from "./setStrokeType";
import { Hole } from "model/Hole";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";

export function newStrokeFromStrokes(strokes: Stroke[], hole: Hole): Stroke {
  const lastStroke = last(strokes);
  let stroke: Stroke = {
    lie: undefined,
    liePos: undefined,
    club: undefined,
    intendedPos: undefined,
    strokePos: undefined,
    strokeType: StrokeType.FULL,
  };
  const strokeNum = strokes.length + 1;
  setStrokeLie(
    ({ lie }) => (stroke.lie = lie),
    strokeNum,
    stroke,
    strokeNum === 1
      ? Lie.TEE
      : lastStroke?.lie === Lie.GREEN
      ? Lie.GREEN
      : undefined
  );
  if (lastStroke) {
    stroke.liePos = lastStroke?.strokePos;
  } else {
    const usedTee = selectCurrentTeeFromHole(hole);
    if (usedTee) stroke.liePos = usedTee.pos;
  }
  setStrokeType(
    ({ strokeType }) => (stroke.strokeType = strokeType),
    strokeNum,
    stroke,
    stroke.strokeType
  );
  return stroke;
}
