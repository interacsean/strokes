import { Hole } from "model/Hole";

export function mergePartHole(hole: Hole, partialHole: Partial<Hole>) {
  return { ...hole, ...partialHole };
}
