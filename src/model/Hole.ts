import { Stroke } from "./Stroke";

export type Hole = {
  holeNum: number;
  strokes: Stroke[];
  par: number;
  // tees
  // pinPos
  // waypoints
}

export type UnknownHole = Omit<Hole, 'holeNum'> & { holeNum?: number };
