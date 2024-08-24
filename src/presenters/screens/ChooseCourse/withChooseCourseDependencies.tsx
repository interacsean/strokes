import { FC } from "react";
import { ChooseCourseView, ChooseCourseViewProps } from "./ChooseCourse.View";
import { auVicMelbourneNorthcote } from "data/courses/au_vic_melbourne_northcote";
import { useCourseState } from "state/course/courseState";
import newCourse from "usecases/course/newCourse";

type ChooseCoursePublicProps = {};

export function withChooseCourseDependencies(
  HoleView: FC<ChooseCourseViewProps>
) {
  return function Hole(_props: ChooseCoursePublicProps) {
    const courses = [auVicMelbourneNorthcote];

    const { setState: setCourseState } = useCourseState();

    const viewProps: ChooseCourseViewProps = {
      courses,
      setCourse: setCourseState,
      newCourse,
    };

    return (
      <>
        <ChooseCourseView {...viewProps} />
      </>
    );
  };
}
