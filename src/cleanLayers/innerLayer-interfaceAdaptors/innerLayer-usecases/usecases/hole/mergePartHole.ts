import { Hole } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Hole";

export function mergePartHole<T>(hole: Hole, partialHole: Partial<Hole>) {
  return { ...hole, ...partialHole };
}
