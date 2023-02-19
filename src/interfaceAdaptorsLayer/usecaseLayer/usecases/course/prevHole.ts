import { Updater } from "types/Updater";

export function prevHole<T>(
  updateCourseState: Updater<{ currentHoleNum: number }, T>
) {
  updateCourseState(
    (state) => ({ currentHoleNum: Math.max(1, state.currentHoleNum - 1)})
  );
}