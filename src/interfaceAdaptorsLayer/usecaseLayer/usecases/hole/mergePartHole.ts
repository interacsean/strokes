import { Hole } from "model/Hole";

export function mergePartHole<T>(
  hole: Hole,
  partialHole: Partial<Hole>,
) {
  return { ...hole, ...partialHole };
}
