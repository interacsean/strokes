import { Hole } from "./Hole";

export class Course {
  public hole: Hole[];
  public currentHole: number;

  constructor(
    factoryProps: {
      hole?: Hole[],
      currentHole?: number;
    }
  ) {
    this.hole = factoryProps.hole || [];
    this.currentHole = factoryProps.currentHole || 1;
  }
}
