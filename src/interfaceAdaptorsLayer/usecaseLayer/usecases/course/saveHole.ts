import { lensPath, set } from "ramda";
import { Updater } from "types/Updater";
import { Hole } from "model/Hole";

type NeededCourseState = {
  currentHoleNum: number;
  holes: Hole[];
};

export function saveHole(
  updateCourseState: Updater<{ holes: Hole[] }, NeededCourseState>,
  hole: Hole,
  holeNum?: number
) {
  updateCourseState((state) => {
    const newHoles = set(
      lensPath([(holeNum ?? state.currentHoleNum) - 1]),
      hole,
      state.holes
    );
    return {
      holes: newHoles,
    };
  });
}
