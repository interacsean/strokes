import { Stroke } from "model/Stroke";

export function mergePartStroke<T>(
  stroke: Stroke,
  partialStroke: Partial<Stroke>
): Stroke {
  return { ...stroke, ...partialStroke };
}
