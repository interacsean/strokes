import { Course } from "model/Course";

const newCourse = (): Course => ({
  courseName: "New course",
  timePlayed: Date.now(),
  currentHoleNum: 1,
  holes: [],
});

export default newCourse;
