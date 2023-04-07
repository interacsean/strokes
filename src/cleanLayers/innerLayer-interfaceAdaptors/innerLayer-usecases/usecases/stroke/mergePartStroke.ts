import { Stroke } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Stroke";

export function mergePartStroke<T>(
  stroke: Stroke,
  partialStroke: Partial<Stroke>
): Stroke {
  return { ...stroke, ...partialStroke };
}
