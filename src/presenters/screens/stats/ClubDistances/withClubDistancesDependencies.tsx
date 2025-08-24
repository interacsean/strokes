import { useRoundsState } from "state/rounds/roundsState";
import { ClubDistancesView, ClubDistancesViewProps } from "./ClubDistances.view";

export function withClubDistancesDependencies() {
  return function ClubDistancesWithDependencies() {
    const { state: rounds } = useRoundsState();

    const props: ClubDistancesViewProps = {
      availableRounds: rounds || [],
    };

    return <ClubDistancesView {...props} />;
  };
}