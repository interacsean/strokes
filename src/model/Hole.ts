import { Stroke } from "./Stroke";
import { LatLng } from "model/LatLng";

export type HoleDef = {
  holeNum: number;
  par: number;
  holePos: LatLng | undefined;
  tees: Record<string, LatLng>;
}

export type Hole = HoleDef & {
  strokes: Stroke[];
  teePlayed: string | undefined;
  completed: boolean;
  // waypoints
};
