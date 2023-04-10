import { Stroke } from "./Stroke";
import { LatLng } from "model/LatLng";

export type Hole = {
  holeNum: number;
  strokes: Stroke[];
  par: number;
  holePos: LatLng | undefined;
  tees: Record<string, LatLng>;
  completed: boolean;
  // waypoints
};
