import { Button, Container, Flex, Text } from "@chakra-ui/react";
import { RoutePaths } from "presenters/routes/RoutePaths";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export type StatsViewProps = {};

function useStatsViewLogic(props: StatsViewProps) {
  const navigate = useNavigate();

  const navigateToStat = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  return {
    navigateToStat,
  };
}

export function StatsView(props: StatsViewProps) {
  const viewLogic = useStatsViewLogic(props);

  return (
    <Container>
      <Text variant="heading">Stats</Text>
      <Flex flexDir="column" alignItems="flex-start">
        <Button
          variant="link"
          py={3}
          onClick={() => viewLogic.navigateToStat(RoutePaths.FairwaysGreens)}
        >
          Fairways/Greens hit by club
        </Button>
        <Button
          variant="link"
          py={3}
          onClick={() => viewLogic.navigateToStat(RoutePaths.ClubDistances)}
        >
          Club distances
        </Button>
        <Button
          variant="link"
          py={3}
          onClick={() => viewLogic.navigateToStat(RoutePaths.ClubStrike)}
        >
          Club strike
        </Button>
        <Button
          variant="link"
          py={3}
          onClick={() => viewLogic.navigateToStat(RoutePaths.GreensInRange)}
        >
          Greens within range by club
        </Button>
      </Flex>
    </Container>
  );
}