import { lensIndex, lensPath, set } from "ramda";
import { Updater } from "types/Updater";
import { Stroke } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Stroke";
import { Hole } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Hole";

type NeededCourseState = {
  currentHoleNum: number;
  holes: Hole[];
};
export function saveStroke(
  updateCourseState: Updater<{ holes: Hole[] }, NeededCourseState>,
  strokeNum: number,
  stroke: Stroke
) {
  updateCourseState((state) =>
    set(
      lensPath(["holes", state.currentHoleNum - 1, "strokes", strokeNum - 1]),
      stroke,
      state
    )
  );
}
