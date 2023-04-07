import { Hole } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Hole";

export const newHole = (): Hole => ({
  holeNum: 1,
  par: 4,
  strokes: [],
  holePos: undefined,
});
