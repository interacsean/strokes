import { Stroke } from "./Stroke";
import { LatLng } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/LatLng";

export type Hole = {
  holeNum: number;
  strokes: Stroke[];
  par: number;
  holePos: LatLng | undefined;
  // tees
  // pinPos
  // waypoints
};

export type UnknownHole = Omit<Hole, "holeNum"> & { holeNum?: number };
