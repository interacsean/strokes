import { Hole } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Hole";
import { useMemo } from "react";
import { atom, useRecoilState } from "recoil";

export type CourseStateSetters = ReturnType<typeof useCourseState>;

export type CourseState = typeof defaultCourse;

export type HoleState = {
  strokes: number[]; // todo: update,
};

const defaultCourse = {
  currentHoleNum: 1,
  holes: [] as Hole[],
  // course metadata here
};

export function useCourseState() {
  const [state, setState] = useRecoilState(courseAtom);

  return useMemo(
    () => ({
      state,
      setState,
      updateState: (
        partialStateOrUpdater:
          | Partial<CourseState>
          | ((st: CourseState) => Partial<CourseState>)
      ) => {
        setState((currentState) => ({
          ...currentState,
          ...(typeof partialStateOrUpdater === "function"
            ? partialStateOrUpdater(currentState)
            : partialStateOrUpdater),
        }));
      },
    }),
    [...Object.values(state)]
  );
}

const courseAtom = atom({
  key: "course",
  default: defaultCourse,
});
