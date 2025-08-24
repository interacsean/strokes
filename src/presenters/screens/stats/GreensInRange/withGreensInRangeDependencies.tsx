import { useRoundsState } from "state/rounds/roundsState";
import { GreensInRangeView, GreensInRangeViewProps } from "./GreensInRange.view";

export function withGreensInRangeDependencies() {
  return function GreensInRangeWithDependencies() {
    const { state: rounds } = useRoundsState();

    const props: GreensInRangeViewProps = {
      availableRounds: rounds || [],
    };

    return <GreensInRangeView {...props} />;
  };
}