import { Updater } from "types/Updater";

export function nextHole<T>(
  updateCourseState: Updater<{ currentHoleNum: number } | null, T>
) {
  updateCourseState((state) => ({
    currentHoleNum: Math.min(18, (state?.currentHoleNum || 0) + 1),
  }));
}
