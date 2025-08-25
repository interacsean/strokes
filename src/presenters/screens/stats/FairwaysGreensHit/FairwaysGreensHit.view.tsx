import { Button, Container, Flex, Text, Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react";
import { Club } from "model/Club";
import { Lie } from "model/Lie";
import { Course } from "model/Course";
import { useMemo, useState } from "react";
import { RoundSelectionModal } from "../components/RoundSelectionModal";
import { useRoundSelection } from "../components/RoundSelectionProvider";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";
import { ModalContainer } from "presenters/components/Modal/Modal";

export type FairwaysGreensHitViewProps = {
  availableRounds: Course[];
};

function useFairwaysGreensHitLogic(props: FairwaysGreensHitViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedRounds } = useRoundSelection();

  const stats = useMemo(() => {
    if (selectedRounds.length === 0) return {};

    const clubStats: Record<Club, { fairwayHits: number; fairwayAttempts: number; greenHits: number; greenAttempts: number }> = {} as any;

    selectedRounds.forEach(round => {
      round.holes.forEach(hole => {
        if (hole.strokes.length === 0) return;

        const firstStroke = hole.strokes[0];
        if (!firstStroke.club) return;

        const currentTee = selectCurrentTeeFromHole(hole);
        const par = currentTee?.par;
        
        if (!clubStats[firstStroke.club]) {
          clubStats[firstStroke.club] = {
            fairwayHits: 0,
            fairwayAttempts: 0,
            greenHits: 0,
            greenAttempts: 0,
          };
        }

        if (par && par >= 4) {
          clubStats[firstStroke.club].fairwayAttempts++;
          if (firstStroke.toLie === Lie.FAIRWAY) {
            clubStats[firstStroke.club].fairwayHits++;
          }
        }

        if (par && par === 3) {
          clubStats[firstStroke.club].greenAttempts++;
          if (firstStroke.toLie === Lie.GREEN) {
            clubStats[firstStroke.club].greenHits++;
          }
        }
      });
    });

    return clubStats;
  }, [selectedRounds]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    stats,
    isModalOpen,
    openModal,
    closeModal,
  };
}

export function FairwaysGreensHitView(props: FairwaysGreensHitViewProps) {
  const logic = useFairwaysGreensHitLogic(props);
  const { selectedRounds } = useRoundSelection();

  const formatPercentage = (hits: number, attempts: number) => {
    if (attempts === 0) return "N/A";
    return `${Math.round((hits / attempts) * 100)}%`;
  };

  return (
    <Box
      position="relative"
      height="100vh"
      px={4}
      py={3}
  >
      {logic.isModalOpen && (
          <ModalContainer>
            <RoundSelectionModal
              rounds={props.availableRounds}
              onClose={logic.closeModal}
            />
          </ModalContainer>
      )}
      <Flex 
        flexDir="column"
        visibility={logic.isModalOpen ? "hidden" : "visible"}
      >
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Text variant="heading">Fairways/Greens Hit by Club</Text>
          <Button variant="outline" onClick={logic.openModal}>
            Select Rounds ({selectedRounds.length})
          </Button>
        </Flex>

        {selectedRounds.length === 0 ? (
          <Text>Select rounds to view statistics</Text>
        ) : Object.keys(logic.stats).length === 0 ? (
          <Text>No data available for selected rounds</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Club</Th>
                <Th>Fw Hit</Th>
                <Th>Gr Hit</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(logic.stats).map(([club, data]) => {
                const clubData = data as { fairwayHits: number; fairwayAttempts: number; greenHits: number; greenAttempts: number };
                return (
                  <Tr key={club}>
                    <Td>{club}</Td>
                    <Td>
                      {clubData.fairwayAttempts > 0 
                        ? `${clubData.fairwayHits}/${clubData.fairwayAttempts} (${formatPercentage(clubData.fairwayHits, clubData.fairwayAttempts)})`
                        : "N/A"}
                    </Td>
                    <Td>
                      {clubData.greenAttempts > 0
                        ? `${clubData.greenHits}/${clubData.greenAttempts} (${formatPercentage(clubData.greenHits, clubData.greenAttempts)})`
                        : "N/A"}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </Flex>
    </Box>
  );
}