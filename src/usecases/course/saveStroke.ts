import { Updater } from "types/Updater";
import { Stroke } from "model/Stroke";
import { Hole } from "model/Hole";
import { saveStrokes } from "./saveStrokes";

type NeededCourseState = {
  currentHoleNum: number;
  holes: Hole[];
};
export function saveStroke(
  updateCourseState: Updater<
    { holes: Hole[] } | null,
    NeededCourseState | null
  >,
  hole: Hole,
  strokeNum: number,
  stroke: Stroke
) {
  saveStrokes(updateCourseState, hole, { [strokeNum]: stroke });
}
