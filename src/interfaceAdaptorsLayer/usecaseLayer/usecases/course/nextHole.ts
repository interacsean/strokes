import { Updater } from "types/Updater";

export function nextHole<T>(
  updateCourseState: Updater<{ currentHoleNum: number }, T>
) {
  updateCourseState((state) => ({
    currentHoleNum: Math.min(18, state.currentHoleNum + 1),
  }));
}
