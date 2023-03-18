import { Stroke } from "./Stroke";
import { LatLng } from "model/LatLng";

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
