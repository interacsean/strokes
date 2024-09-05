import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";

export function setStrokeToLie(
  setHoleAttr: (partStroke: Partial<Stroke>) => void,
  strokeNum: number,
  stroke: Stroke | undefined,
  lie: Lie | undefined
) {
  const attrs: Partial<Stroke> = {
    toLie: lie,
  };
  return setHoleAttr(attrs);
}
