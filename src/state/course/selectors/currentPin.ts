import { CourseState } from "../courseState";
import { selectCurrentHole } from "./currentHole";
import { Hole } from "model/Hole";

export const selectCurrentPin = (courseState: CourseState) => {
  const hole = selectCurrentHole(courseState);
  return selectCurrentPinFromHole(hole);
};

export const selectCurrentPinFromHole = (
  hole: Pick<Hole, "pinPlayed" | "pins">
) => (hole.pinPlayed ? hole.pins[hole.pinPlayed] : Object.values(hole.pins)[0]);
