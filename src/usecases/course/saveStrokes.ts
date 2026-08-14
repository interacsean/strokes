import { lensPath, set } from "ramda";
import { Updater } from "types/Updater";
import { Stroke } from "model/Stroke";
import { Hole } from "model/Hole";

type NeededCourseState = {
  currentHoleNum: number;
  holes: Hole[];
};

/**
 * Writes several of the hole's strokes in one update. Saving them one at a time
 * loses all but the last: each save starts from the same captured hole, so the
 * next one writes back over the stroke the one before it just changed.
 */
export function saveStrokes(
  updateCourseState: Updater<
    { holes: Hole[] } | null,
    NeededCourseState | null
  >,
  hole: Hole,
  strokesByNum: Record<number, Stroke>
) {
  updateCourseState((state) => {
    const holeIndex = (state?.currentHoleNum || 1) - 1;
    const updatedStateHole = set(lensPath(["holes", holeIndex]), hole, state);

    return Object.entries(strokesByNum).reduce(
      (updatedState, [strokeNum, stroke]) =>
        set(
          lensPath(["holes", holeIndex, "strokes", Number(strokeNum) - 1]),
          stroke,
          updatedState
        ),
      updatedStateHole
    );
  });
}
