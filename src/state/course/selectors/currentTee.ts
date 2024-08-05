import { CourseState } from "../courseState";
import { selectCurrentHole } from "./currentHole";
import { Hole } from "model/Hole";

export const selectCurrentPin = (courseState: CourseState) => {
  const hole = selectCurrentHole(courseState);
  return selectCurrentTeeFromHole(hole);
};

export const selectCurrentTeeFromHole = (
  hole: Pick<Hole, "teePlayed" | "tees">
) => (hole.teePlayed ? hole.tees[hole.teePlayed] : Object.values(hole.tees)[0]);
