import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";
import { StrokeType } from "model/StrokeType";
import { last } from "ramda";
import { setStrokeLie } from "./setStrokeLie";
import { setStrokeType } from "./setStrokeType";

export function newStrokeFromStrokes(strokes: Stroke[]): Stroke {
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
  stroke = {
    ...stroke,
    ...setStrokeLie(
      strokeNum,
      stroke,
      strokeNum === 1
        ? Lie.TEE
        : lastStroke?.lie === Lie.GREEN
        ? Lie.GREEN
        : undefined
    ),
  };
  stroke = {
    ...stroke,
    ...setStrokeType(strokeNum, stroke, stroke.strokeType),
  };
  return stroke;
}
