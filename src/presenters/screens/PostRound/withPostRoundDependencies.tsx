import { FC } from "react";
import { PostRoundView, PostRoundViewProps } from "./PostRound.view";
import { useCourseState } from "state/course/courseState";
import { useRoundsState } from "state/rounds/roundsState";

type PostRoundPublicProps = {};

export function withPostRoundDependencies(HoleView: FC<PostRoundViewProps>) {
  return function Hole(_props: PostRoundPublicProps) {
    const { state: round } = useCourseState();
    const { upsertRound: saveRound } = useRoundsState();

    const props = {
      saveRound,
    };

    return (
      <>
        {round ? (
          <PostRoundView {...props} round={round} />
        ) : (
          "No round available"
        )}
      </>
    );
  };
}
