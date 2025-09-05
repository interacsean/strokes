import { Button, Flex, Text } from "@chakra-ui/react";
import { Course } from "model/Course";

export type PreviousRoundsViewProps = {
  rounds: Course[];
  onRoundSelect: (round: Course) => void;
};

export function PreviousRoundsView(props: PreviousRoundsViewProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Flex flexDir="column" px={4} py={3}>
      <Text variant="heading" mb={4}>
        Previous Rounds
      </Text>
      {props.rounds.length === 0 ? (
        <Text variant="text">No previous rounds found. Play some golf to see your history!</Text>
      ) : (
        props.rounds.map((round) => (
          <Button
            key={round.timePlayed}
            variant="ghost"
            py={3}
            px={2}
            justifyContent="flex-start"
            onClick={() => props.onRoundSelect(round)}
            width="100%"
          >
            <Flex flexDir="column" alignItems="flex-start">
              <Text fontWeight="medium">{round.courseName}</Text>
              <Text fontSize="sm" color="gray.600">
                {formatDate(round.timePlayed)} • {round.holes.length} holes
              </Text>
            </Flex>
          </Button>
        ))
      )}
    </Flex>
  );
}