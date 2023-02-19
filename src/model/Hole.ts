import { Stroke } from "./Stroke";

export type Hole = {
  holeNum: number;
  strokes: Stroke[];
}

export type UnknownHole = Omit<Hole, 'holeNum'> & { holeNum?: number };
