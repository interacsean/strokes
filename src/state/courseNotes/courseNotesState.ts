import { localStoragePersistenceEffect } from "persistence/localStoragePersistence";
import { useMemo } from "react";
import { atom, useRecoilState } from "recoil";

// Notes keyed by course name, then by hole number. Persisted against the
// course (not a round) so they carry across every round of that course.
export type CourseNotesState = Record<string, Record<number, string>>;

export function useCourseNotesState() {
  const [state, setState] = useRecoilState(courseNotesAtom);

  return useMemo(
    () => ({
      state,
      setState,
      getHoleNote: (courseName: string, holeNum: number): string =>
        state[courseName]?.[holeNum] ?? "",
      setHoleNote: (courseName: string, holeNum: number, note: string) => {
        setState((currentState) => ({
          ...currentState,
          [courseName]: {
            ...currentState[courseName],
            [holeNum]: note,
          },
        }));
      },
    }),
    // eslint-disable-next-line
    [setState, state]
  );
}

const courseNotesAtom = atom<CourseNotesState>({
  key: "courseNotes",
  default: {},
  effects: [localStoragePersistenceEffect("strokes_0.2_courseNotes")],
});
