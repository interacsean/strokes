import { newHole } from "usecases/hole/newHole";
import { CourseState } from "../courseState";

export const selectCurrentHole = (courseState: CourseState) =>
  courseState.holes[courseState.currentHoleNum - 1] || {
    ...newHole(),
    holeNum: courseState.currentHoleNum,
  };
