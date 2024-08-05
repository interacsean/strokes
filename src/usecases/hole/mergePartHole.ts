import { Hole } from "model/Hole";
import { mergeDeepRight } from "ramda";
import { DeepPartial } from "types/DeepPartial";

export function mergePartHole(hole: Hole, partialHole: DeepPartial<Hole>) {
  return mergeDeepRight(hole, partialHole);
}
