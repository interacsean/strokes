import { Stroke } from "model/Stroke";

export function mergePartStroke(
  stroke: Stroke,
  partialStroke: Partial<Stroke>
): Stroke {
  return { ...stroke, ...partialStroke };
}
