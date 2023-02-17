import { atom, useRecoilState } from "recoil";

const defaultCourse = {
  currentHoleNum: 1,
  holes: [],
  // course metadata here
};

export function useCourseState() {
  const [state, setState] = useRecoilState(courseAtom);
  return {
    course: state,
    setCurrentHole: (newCurrentHole: number) => setState({ ...state, currentHoleNum: newCurrentHole }),
    currentHole: state.holes[state.currentHoleNum - 1],
    currentHoleNum: state.currentHoleNum,
    resetCourse: setState(defaultCourse),
  }
}

export type CourseState = ReturnType<typeof useCourseState>;

const courseAtom = atom({
  key: 'course',
  default: defaultCourse,
});
