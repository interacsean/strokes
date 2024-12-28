import { FC, useMemo } from "react";
import { ChooseCourseView, ChooseCourseViewProps } from "./ChooseCourse.View";
import { auVicMelbourneDocklandsTest } from "data/courses/au_vic_melbourne_testCourseDocklands";
import { auVicMelbourneFlagstaffTest } from "data/courses/au_vic_melbourne_testCourseFlagstaff";
import { auVicMelbourneBurnley } from "data/courses/au_vic_melbourne_burnleyPublic";
import { auVicMelbourneNorthcote } from "data/courses/au_vic_melbourne_northcote";
import { auVicMelbourneOakleigh } from "data/courses/au_vic_melbourne_oakleigh";
import { auVicMelbourneRiverside } from "data/courses/au_vic_melbourne_riverside";
import { auVicMelbourneRoyalPark } from "data/courses/au_vic_melbourne_royalPark";
import { auVicMelbourneWestgate } from "data/courses/au_vic_melbourne_westgate";
import { auVicGippslandMorwellGolfClub } from "data/courses/au_vic_gippsland_morwellGolfClub";
import { useCourseState } from "state/course/courseState";
import newCourse from "usecases/course/newCourse";

type ChooseCoursePublicProps = {};

export function withChooseCourseDependencies(
  HoleView: FC<ChooseCourseViewProps>
) {
  return function Hole(_props: ChooseCoursePublicProps) {
    const courses = [
      auVicMelbourneBurnley,
      auVicMelbourneNorthcote,
      auVicMelbourneOakleigh,
      auVicMelbourneRiverside,
      auVicMelbourneRoyalPark,
      auVicMelbourneWestgate,
      auVicMelbourneFlagstaffTest,
      auVicMelbourneDocklandsTest,
      auVicGippslandMorwellGolfClub,
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
