import { Hole, HoleDef } from "./Hole";

export type CourseDef = {
  courseName: string;
  holes: HoleDef[];
};

export type Course = Omit<CourseDef, "hole"> & {
  currentHole: number;
  holes: Hole[];
};
