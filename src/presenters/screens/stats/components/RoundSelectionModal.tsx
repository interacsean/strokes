import { Button, Flex, Text, Checkbox } from "@chakra-ui/react";
import { Course } from "model/Course";
import { Modal } from "presenters/components/Modal/Modal";
import { useRoundSelection } from "./RoundSelectionProvider";

type RoundSelectionModalProps = {
  rounds: Course[];
  onClose: () => void;
};

export function RoundSelectionModal(props: RoundSelectionModalProps) {
  const { selectedRounds, toggleRoundSelection, isRoundSelected } = useRoundSelection();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Modal onClose={props.onClose}>
      <Flex justifyContent="flex-start" mb={4} flexDir="column">
        <Text variant="heading" mb={4}>
          Select Rounds for Stats
        </Text>
        <Text variant="text" mb={4} fontSize="sm" color="gray.600">
          Select which rounds to include in your statistics
        </Text>
        {props.rounds.length === 0 ? (
          <Text variant="text">No rounds found. Play some golf to see stats!</Text>
        ) : (
          props.rounds.map((round) => (
            <Button
              key={round.timePlayed}
              variant="ghost"
              py={3}
              px={2}
              justifyContent="flex-start"
              onClick={() => toggleRoundSelection(round)}
              width="100%"
            >
              <Flex alignItems="center" width="100%">
                <Checkbox
                  isChecked={isRoundSelected(round)}
                  readOnly
                  mr={3}
                />
                <Flex flexDir="column" alignItems="flex-start">
                  <Text fontWeight="medium">{round.courseName}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {formatDate(round.timePlayed)} • {round.holes.length} holes
                  </Text>
                </Flex>
              </Flex>
            </Button>
          ))
        )}
        <Flex mt={4} justifyContent="space-between">
          <Button variant="outline" onClick={props.onClose}>
            Done
          </Button>
          <Text fontSize="sm" color="gray.600">
            {selectedRounds.length} round{selectedRounds.length !== 1 ? 's' : ''} selected
          </Text>
        </Flex>
      </Flex>
    </Modal>
  );
}