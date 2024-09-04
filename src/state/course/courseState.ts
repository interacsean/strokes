import { Course } from "model/Course";
import { Hole } from "model/Hole";
import { localStoragePersistenceEffect } from "persistence/localStoragePersistence";
import { useMemo } from "react";
import { atom, useRecoilState } from "recoil";

export type CourseStateSetters = ReturnType<typeof useCourseState>;

export type CourseState = typeof defaultCourse | null;

export type HoleState = {
  strokes: number[]; // todo: update,
};

const defaultCourse: Course = {
  courseName: "Default course",
  currentHoleNum: 1,
  holes: [] as Hole[],
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
        setState((currentState) =>
          currentState
            ? {
                ...currentState,
                ...(typeof partialStateOrUpdater === "function"
                  ? partialStateOrUpdater(currentState)
                  : partialStateOrUpdater),
              }
            : null
        );
      },
    }),
    // eslint-disable-next-line
    [setState, ...Object.values(state || {})]
  );
}

const courseAtom = atom<CourseState>({
  key: "course",
  default: null,
  effects: [localStoragePersistenceEffect("strokes_course")],
});
