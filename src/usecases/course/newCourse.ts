import { Course } from "model/Course";

const newCourse = (): Course => ({
  courseName: "New course",
  currentHoleNum: 1,
  holes: [],
});

export default newCourse;
