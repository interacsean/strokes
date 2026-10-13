import { Course } from "model/Course";
import { newHole } from "usecases/hole/newHole";

/** A course set up on the fly has no scorecard to say how long it is, so it
 * runs to a full round; the last hole is where the round can be finished. */
const NEW_COURSE_HOLE_COUNT = 18;

const newCourse = (): Course => ({
  courseName: "New course",
  timePlayed: Date.now(),
  currentHoleNum: 1,
  holes: Array.from({ length: NEW_COURSE_HOLE_COUNT }, (_, i) => ({
    ...newHole(),
    holeNum: i + 1,
  })),
});

export default newCourse;
