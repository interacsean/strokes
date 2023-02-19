import { lensIndex, set } from "ramda";
import { Updater } from "types/Updater";
import { Hole } from "model/Hole";

export function saveHole<T extends {}>(
  updateCourseState: Updater<{ holes: Hole[] }, T>,
  hole: Hole,
  holeNum: number,
) {
  updateCourseState(
    (state) => ({
      holes: set(lensIndex(holeNum - 1), hole, state.holes),
    })
  );
}
