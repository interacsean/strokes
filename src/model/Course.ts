import { Hole, HoleDef } from "./Hole";

export type CourseDef = {
  courseName: string;
  holes: HoleDef[];
};

export type Course = Omit<CourseDef, "holes"> & {
  currentHoleNum: number;
  holes: Hole[];
};
