import { Stroke } from "./Stroke";

export class Hole {
  public holeNum: number;
  public strokes: Stroke[];

  constructor(
    factoryProps: { 
      holeNum: number, 
      strokes?: Stroke[]
    }
  ) {
    this.holeNum = factoryProps.holeNum;
    this.strokes = factoryProps.strokes || [];
  }
}
