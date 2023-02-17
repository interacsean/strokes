import { Updater } from "types/Updater";

export function makePrevHole<T>(
  updateCourseState: Updater<{ currentHoleNum: number }, T>
) {
  return function prevHole() {
    updateCourseState(
      (state) => ({ currentHoleNum: Math.max(1, state.currentHoleNum - 1)})
    );
  }
}