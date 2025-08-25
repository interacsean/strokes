import { 
  Button, 
  Container, 
  Flex, 
  Text, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td 
} from "@chakra-ui/react";
import { Course } from "model/Course";
import { Club } from "model/Club";
import { Lie } from "model/Lie";
import { StrokeType } from "model/StrokeType";
import { PosOptionMethods } from "model/PosOptions";
import { useMemo, useState } from "react";
import { RoundSelectionModal } from "../components/RoundSelectionModal";
import { useRoundSelection } from "../components/RoundSelectionProvider";
import { selectCurrentPinFromHole } from "state/course/selectors/currentPin";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";
import { selectClubStats } from "state/rounds/selectors/clubStats";

export type GreensInRangeViewProps = {
  availableRounds: Course[];
};

const ALLOWED_STROKE_TYPES = [
  StrokeType.FULL,
  StrokeType.LOW,
  StrokeType.LOW_FADE,
  StrokeType.LOW_DRAW,
  StrokeType.HIGH,
  StrokeType.HIGH_FADE,
  StrokeType.HIGH_DRAW,
  StrokeType.DRAW,
  StrokeType.FADE,
  StrokeType.THREE_QTR,
  StrokeType.PITCH,
];

function useGreensInRangeLogic() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedRounds } = useRoundSelection();

  const stats = useMemo(() => {
    if (selectedRounds.length === 0) return {};

    // Get club stats for distance ranges
    const clubStats = selectClubStats([]);
    
    const clubRangeStats: Record<Club, { inRangeAttempts: number; greenHits: number }> = {} as any;

    selectedRounds.forEach(round => {
      round.holes.forEach(hole => {
        const pin = selectCurrentPinFromHole(hole);
        if (!pin) return; // Skip if no pin position

        hole.strokes.forEach(stroke => {
          if (!stroke.club || !stroke.fromPos || !stroke.strokeType) return;
          
          // Only include allowed stroke types
          if (!ALLOWED_STROKE_TYPES.includes(stroke.strokeType)) return;
          
          // Calculate distance to pin from starting position
          const distanceToPin = calculateDistanceBetweenPositions(stroke.fromPos, pin);
          
          // Get the club's max range (sd1Distances[1] - upper bound of first std dev)
          const clubStat = clubStats[stroke.club]?.[StrokeType.FULL];
          if (!clubStat) return;
          
          const maxClubDistance = clubStat.sd1Distances[1];
          
          // Check if pin is within range
          if (distanceToPin <= maxClubDistance) {
            // Pin is within range - this is a green approach attempt
            if (!clubRangeStats[stroke.club]) {
              clubRangeStats[stroke.club] = {
                inRangeAttempts: 0,
                greenHits: 0,
              };
            }
            
            clubRangeStats[stroke.club].inRangeAttempts++;
            
            // Check if the shot ended up on the green or in the hole
            if (stroke.toLie === Lie.GREEN || stroke.toPosSetMethod === PosOptionMethods.HOLE) {
              clubRangeStats[stroke.club].greenHits++;
            }
          }
        });
      });
    });

    return clubRangeStats;
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

export function GreensInRangeView(props: GreensInRangeViewProps) {
  const logic = useGreensInRangeLogic();
  const { selectedRounds } = useRoundSelection();

  const formatPercentage = (hits: number, attempts: number) => {
    if (attempts === 0) return "0%";
    return `${Math.round((hits / attempts) * 100)}%`;
  };

  return (
    <Container>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text variant="heading">Greens Within Range by Club</Text>
        <Button variant="outline" onClick={logic.openModal}>
          Select Rounds ({selectedRounds.length})
        </Button>
      </Flex>

      {selectedRounds.length === 0 ? (
        <Text>Select rounds to view statistics</Text>
      ) : Object.keys(logic.stats).length === 0 ? (
        <Text>No approach shots within range found in selected rounds</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Club</Th>
              <Th>Green Hit</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(logic.stats).map(([club, data]) => {
              const statData = data as { inRangeAttempts: number; greenHits: number };
              return (
                <Tr key={club}>
                  <Td>{club}</Td>
                  <Td>
                    {statData.greenHits}/{statData.inRangeAttempts} (
                    {formatPercentage(statData.greenHits, statData.inRangeAttempts)})
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}

      {logic.isModalOpen && (
        <RoundSelectionModal
          rounds={props.availableRounds}
          onClose={logic.closeModal}
        />
      )}
    </Container>
  );
}