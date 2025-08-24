import { Button, Container, Flex, Text } from "@chakra-ui/react";
import { Course } from "model/Course";
import { useState } from "react";
import { RoundSelectionModal } from "../components/RoundSelectionModal";
import { useRoundSelection } from "../components/RoundSelectionProvider";

export type ClubDistancesViewProps = {
  availableRounds: Course[];
};

export function ClubDistancesView(props: ClubDistancesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedRounds } = useRoundSelection();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Container>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text variant="heading">Club Distances</Text>
        <Button variant="outline" onClick={openModal}>
          Select Rounds ({selectedRounds.length})
        </Button>
      </Flex>

      <Text>Club distances statistics - Coming soon</Text>

      {isModalOpen && (
        <RoundSelectionModal
          rounds={props.availableRounds}
          onClose={closeModal}
        />
      )}
    </Container>
  );
}