import { FC } from "react";
import { PostRoundView, PostRoundViewProps } from "./PostRound.view";
import { useCourseState } from "state/course/courseState";

type PostRoundPublicProps = {};

export function withPostRoundDependencies(HoleView: FC<PostRoundViewProps>) {
  return function Hole(_props: PostRoundPublicProps) {
    const { state: round } = useCourseState();

    return (
      <>{round ? <PostRoundView round={round} /> : "No round available"}</>
    );
  };
}
