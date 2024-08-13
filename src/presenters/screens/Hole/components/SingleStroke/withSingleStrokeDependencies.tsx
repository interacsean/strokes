import { FC } from "react";
import { SingleStrokeView, SingleStrokeViewProps } from "./SingleStroke.view";
import { Club } from "model/Club";

type SingleStrokePublicProps = Omit<SingleStrokeViewProps, "clubs">;

export function withSingleStrokeDependencies(
  HoleView: FC<SingleStrokeViewProps>
) {
  return function Hole(props: SingleStrokePublicProps) {
    // todo: get possible clubs from Bag state
    const viewProps: SingleStrokeViewProps = {
      ...props,
      clubs: [
        Club.D,
        Club["3W"],
        Club["4H"],
        Club["4I"],
        Club["5I"],
        Club["6I"],
        Club["7I"],
        Club["8I"],
        Club["9I"],
        Club.PW,
        Club.SW,
        Club.P,
      ],
    };

    return (
      <>
        <SingleStrokeView {...viewProps} />
      </>
    );
  };
}
