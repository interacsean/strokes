import { useNavigate } from "react-router-dom";
import { useRoundsState } from "state/rounds/roundsState";
import { useCourseState } from "state/course/courseState";
import { Course } from "model/Course";
import { RoutePaths } from "presenters/routes/RoutePaths";
import { FC } from "react";
import { PreviousRoundsViewProps } from "./PreviousRounds.view";

type PreviousRoundsPublicProps = {};

export function withPreviousRoundsDependencies<T>(Component: FC<PreviousRoundsViewProps>) {
  return function PreviousRoundsWithDependencies(_props: PreviousRoundsPublicProps) {
    const { state: rounds } = useRoundsState();
    const { setState: setCourse } = useCourseState();
    const navigate = useNavigate();

    const handleRoundSelect = (round: Course) => {
      const historicalRound = {
        ...round,
        historical: true
      };
      setCourse(historicalRound);
      navigate(RoutePaths.Hole);
    };

    return (
      <Component
        rounds={rounds || []}
        onRoundSelect={handleRoundSelect}
      />
    );
  };
}