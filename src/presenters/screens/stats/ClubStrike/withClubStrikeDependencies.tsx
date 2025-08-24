import { useRoundsState } from "state/rounds/roundsState";
import { ClubStrikeView, ClubStrikeViewProps } from "./ClubStrike.view";

export function withClubStrikeDependencies() {
  return function ClubStrikeWithDependencies() {
    const { state: rounds } = useRoundsState();

    const props: ClubStrikeViewProps = {
      availableRounds: rounds || [],
    };

    return <ClubStrikeView {...props} />;
  };
}