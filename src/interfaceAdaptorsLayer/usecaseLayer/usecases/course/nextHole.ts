import { Updater } from "types/Updater";

export function makeNextHole<T>(
  updateCourseState: Updater<{ currentHoleNum: number }, T>
) {
  return function nextHole() {
    updateCourseState(
      (state) => ({ currentHoleNum: Math.min(18, state.currentHoleNum + 1)})
    );
  }
}