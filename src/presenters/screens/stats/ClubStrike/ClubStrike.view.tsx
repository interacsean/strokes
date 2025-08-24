import { Button, Container, Flex, Text } from "@chakra-ui/react";
import { Course } from "model/Course";
import { useState } from "react";
import { RoundSelectionModal } from "../components/RoundSelectionModal";
import { useRoundSelection } from "../components/RoundSelectionProvider";

export type ClubStrikeViewProps = {
  availableRounds: Course[];
};

export function ClubStrikeView(props: ClubStrikeViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedRounds } = useRoundSelection();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Container>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text variant="heading">Club Strike</Text>
        <Button variant="outline" onClick={openModal}>
          Select Rounds ({selectedRounds.length})
        </Button>
      </Flex>

      <Text>Club strike statistics - Coming soon</Text>

      {isModalOpen && (
        <RoundSelectionModal
          rounds={props.availableRounds}
          onClose={closeModal}
        />
      )}
    </Container>
  );
}