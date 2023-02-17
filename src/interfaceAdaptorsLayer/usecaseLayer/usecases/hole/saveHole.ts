import { Hole } from "interfaceAdaptorsLayer/usecaseLayer/entityLayer/entities/Hole";
import { CourseState } from "state/state";
import { lensIndex, set } from "ramda";
import { Updater } from "types/Updater";

export function makeSaveHole<T extends {}>(
  updateCourseState: Updater<{ holes: Hole[] }, T>
) {
  return function saveHole(hole: Hole, holeNum: number) {
    updateCourseState(
      (state) => ({
        holes: set(lensIndex(holeNum - 1), hole, state.holes),
      })
    );
  }
}
