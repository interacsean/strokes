import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Course } from "model/Course";
import { ScoreCard } from "presenters/components/Scorecard/ScoreCard.view";
import { RoutePaths } from "presenters/routes/RoutePaths";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export type PostRoundViewProps = {
  round: Course;
  saveRound: (round: Course) => void;
};

function usePostRoundViewLogic(props: PostRoundViewProps) {
  const navigate = useNavigate();

  const saveAndExit = useCallback(() => {
    props.saveRound(props.round);
    navigate(RoutePaths.Home);
  }, [navigate, props.saveRound, props.round]);

  const discardAndExit = useCallback(() => {
    navigate(RoutePaths.Home);
  }, [navigate]);

  const backToRound = useCallback(() => {
    navigate(RoutePaths.Hole);
  }, [navigate]);

  return {
    saveAndExit,
    discardAndExit,
    backToRound,
  };
}

export function PostRoundView(props: PostRoundViewProps) {
  const viewLogic = usePostRoundViewLogic(props);

  return (
    <Flex flexDir="column" px={4} rowGap={4}>
      <Box>
        <Button onClick={viewLogic.backToRound} variant="ghost">
          <ChevronLeftIcon /> Back to round
        </Button>
      </Box>
      <ScoreCard round={props.round} />
      <Button onClick={viewLogic.saveAndExit}>Complete round</Button>
      <Button onClick={viewLogic.discardAndExit} variant="ghost">
        Discard round
      </Button>
    </Flex>
  );
}
