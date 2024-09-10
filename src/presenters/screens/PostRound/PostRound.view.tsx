import { Course } from "model/Course";
import { ScoreCard } from "presenters/components/Scorecard/ScoreCard.view";

export type PostRoundViewProps = {
  round: Course;
};

function usePostRoundViewLogic(props: PostRoundViewProps) {
  return {};
}

export function PostRoundView(props: PostRoundViewProps) {
  const viewLogic = usePostRoundViewLogic(props);

  // todo: Save round option
  // todo: padding etc
  return (
    <>
      <ScoreCard round={props.round} />
    </>
  );
}
