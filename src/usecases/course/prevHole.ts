import { Updater } from "types/Updater";

export function prevHole<T>(
  updateCourseState: Updater<{ currentHoleNum: number } | null, T>
) {
  updateCourseState((state) => ({
    currentHoleNum: Math.max(1, (state?.currentHoleNum || 0) - 1),
  }));
}
