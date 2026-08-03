import { FC, useMemo } from "react";
import { ChooseCourseViewProps } from "./ChooseCourse.View";
import newCourse from "usecases/course/newCourse";
import loadCourseFromJson from "usecases/course/loadCourseFromJson";
import { useCourseState } from "state/course/courseState";

// Import course data
import { auVicMelbourneAltonaLakesGolfCourse } from "data/courses/au_vic_melbourne_altonaLakesPublic";
import { auVicMelbourneBurnley } from "data/courses/au_vic_melbourne_burnleyPublic";
import { auVicMelbourneNorthcote } from "data/courses/au_vic_melbourne_northcote";
import { auVicMelbourneOakleigh } from "data/courses/au_vic_melbourne_oakleigh";
import { auVicMelbourneRiverside } from "data/courses/au_vic_melbourne_riverside";
import { auVicMelbourneRoyalPark } from "data/courses/au_vic_melbourne_royalPark";
import { auVicMelbourneYarraBendPublic } from "data/courses/au_vic_melbourne_yarraBendPublic";
import { auVicMelbourneWestgate } from "data/courses/au_vic_melbourne_westgate";
import { auVicGippslandMorwellGolfClub } from "data/courses/au_vic_gippsland_morwellGolfClub";
import { auVicGippslandYarramGolfClub } from "data/courses/au_vic_gippsland_yarramGolfClub";
import { auVicGeelongElchoParkGolfCourse } from "data/courses/au_vic_geelong_laraElchoParkGolfCourse";
import { auVicMelbourneIvanhoePublic } from "data/courses/au_vic_melbourne-ivanhoePublic";
import { auNswSydneyBeveryleyPark } from "data/courses/au_nsw_sydney_beverleyPark";
import { auVicMelbourneSanctuaryLakes } from "data/courses/au_vic_melbourne_sanctuaryLakes";
import { auVicMelbourneStudleyGreens } from "data/courses/au_vic_melbourne_studleyGreens";

type ChooseCoursePublicProps = {};

export function withChooseCourseDependencies(
  HoleView: FC<ChooseCourseViewProps>
) {
  return function Hole(_props: ChooseCoursePublicProps) {
    const courses = [
      auVicMelbourneAltonaLakesGolfCourse,
      auVicMelbourneBurnley,
      auVicMelbourneIvanhoePublic,
      auVicMelbourneNorthcote,
      auVicMelbourneOakleigh,
      auVicMelbourneRiverside,
      auVicMelbourneRoyalPark,
      auVicMelbourneSanctuaryLakes,
      auVicMelbourneStudleyGreens,
      auVicMelbourneYarraBendPublic,
      auVicMelbourneWestgate,
      auVicGeelongElchoParkGolfCourse,
      auVicGippslandMorwellGolfClub,
      auVicGippslandYarramGolfClub,
      auNswSydneyBeveryleyPark,
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
      loadCourseFromJson,
    };

    return (
      <>
        <HoleView {...viewProps} />
      </>
    );
  };
}
