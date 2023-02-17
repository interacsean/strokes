// Can I import from this deep in CLEAN?
import { Stroke } from "interfaceAdaptorsLayer/usecaseLayer/entityLayer/entities/Stroke";
import { atom, useRecoilState } from "recoil";

export type CourseStateSetters = ReturnType<typeof useCourseState>;

export type CourseState = typeof defaultCourse;

export type HoleState = {
  strokes: number[] // todo: update,
}

const defaultCourse = {
  currentHoleNum: 1,
  holes: [] as Stroke[],
  // course metadata here
};

export function useCourseState() {
  const [ state, setState ] = useRecoilState(courseAtom);
  return {  
    state,
    setState,
    updateState: (partialStateOrUpdater: (Partial<CourseState> | ((st: CourseState) => Partial<CourseState>))) =>
      setState(currentState => ({ 
        ...currentState, 
        ...(typeof partialStateOrUpdater === 'function' 
          ? partialStateOrUpdater(currentState)
          : partialStateOrUpdater
        )
      })),
  }
}

const courseAtom = atom({
  key: "course",
  default: defaultCourse,
});
