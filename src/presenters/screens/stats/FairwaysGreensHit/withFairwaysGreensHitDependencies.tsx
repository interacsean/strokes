import { useRoundsState } from "state/rounds/roundsState";
import { FairwaysGreensHitView, FairwaysGreensHitViewProps } from "./FairwaysGreensHit.view";

export function withFairwaysGreensHitDependencies() {
  return function FairwaysGreensHitWithDependencies() {
    const { state: rounds } = useRoundsState();

    const props: FairwaysGreensHitViewProps = {
      availableRounds: rounds || [],
    };

    return <FairwaysGreensHitView {...props} />;
  };
}