import { FC, useMemo } from "react";
import { ChooseCourseView, ChooseCourseViewProps } from "./ChooseCourse.View";
import { auVicMelbourneNorthcote } from "data/courses/au_vic_melbourne_northcote";
import { auVicMelbourneFlagstaffTest } from "data/courses/au_vic_melbourne_testCourseFlagstaff";
import { auVicMelbourneDocklandsTest } from "data/courses/au_vic_melbourne_testCourseDocklands";
import { auVicMelbourneWestgate } from "data/courses/au_vic_melbourne_westgate";
import { auVicMelbourneRoyalPark } from "data/courses/au_vic_melbourne_royalPark";
import { useCourseState } from "state/course/courseState";
import newCourse from "usecases/course/newCourse";

type ChooseCoursePublicProps = {};

export function withChooseCourseDependencies(
  HoleView: FC<ChooseCourseViewProps>
) {
  return function Hole(_props: ChooseCoursePublicProps) {
    const courses = [
      auVicMelbourneNorthcote,
      auVicMelbourneRoyalPark,
      auVicMelbourneWestgate,
      auVicMelbourneFlagstaffTest,
      auVicMelbourneDocklandsTest,
    ];

    const { setState: setCourseState, state: courseState } = useCourseState();
    const hasIncompleteCourse = useMemo(() => {
      return !!courseState;
    }, [courseState]);

    const viewProps: ChooseCourseViewProps = {
      courses,
      setCourse: setCourseState,
      newCourse,
      hasIncompleteCourse,
    };

    return (
      <>
        <ChooseCourseView {...viewProps} />
      </>
    );
  };
}
