import { lensPath, set } from "ramda";
import { Updater } from "types/Updater";
import { Stroke } from "model/Stroke";
import { Hole } from "model/Hole";

type NeededCourseState = {
  currentHoleNum: number;
  holes: Hole[];
};
export function saveStroke(
  updateCourseState: Updater<{ holes: Hole[] }, NeededCourseState>,
  hole: Hole,
  strokeNum: number,
  stroke: Stroke
) {
  updateCourseState((state) => {
    const updatedStateHole = set(
      lensPath(["holes", state.currentHoleNum - 1]),
      hole,
      state
    );
    return set(
      lensPath(["holes", state.currentHoleNum - 1, "strokes", strokeNum - 1]),
      stroke,
      updatedStateHole
    );
  });
}
