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
  Td,
} from "@chakra-ui/react";
import { Course } from "model/Course";
import { Club } from "model/Club";
import { Strike } from "model/Strike";
import { StrokeType } from "model/StrokeType";
import { useMemo, useState } from "react";
import { RoundSelectionModal } from "../components/RoundSelectionModal";
import { useRoundSelection } from "../components/RoundSelectionProvider";

export type ClubStrikeViewProps = {
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

// Strike types to display in columns
const STRIKE_COLUMNS = [
  Strike.Clean,
  Strike.Thin,
  Strike.Fat,
  Strike.Hook,
  Strike.Skyball,
  Strike.Slice,
  Strike.Shank,
];

function useClubStrikeLogic(props: ClubStrikeViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedRounds } = useRoundSelection();

  const stats = useMemo(() => {
    if (selectedRounds.length === 0) return {};

    const clubStrikeStats: Record<Club, Record<Strike, number>> = {} as any;

    selectedRounds.forEach(round => {
      round.holes.forEach(hole => {
        hole.strokes.forEach(stroke => {
          if (!stroke.club || !stroke.strike || !stroke.strokeType) return;
          
          // Only include allowed stroke types
          if (!ALLOWED_STROKE_TYPES.includes(stroke.strokeType)) return;

          const club = stroke.club;
          const strikeType = stroke.strike;

          if (!clubStrikeStats[club]) {
            clubStrikeStats[club] = {} as Record<Strike, number>;
            // Initialize all strike types to 0
            STRIKE_COLUMNS.forEach(strike => {
              clubStrikeStats[club][strike] = 0;
            });
          }

          // Increment the count for this strike type
          if (clubStrikeStats[club][strikeType] !== undefined) {
            clubStrikeStats[club][strikeType]++;
          }
        });
      });
    });

    // Calculate totals for percentages
    const processedStats: Record<Club, { strikes: Record<Strike, number>; total: number }> = {} as any;
    
    Object.entries(clubStrikeStats).forEach(([club, strikes]) => {
      const total = Object.values(strikes).reduce((sum, count) => sum + count, 0);
      processedStats[club as Club] = {
        strikes,
        total,
      };
    });

    return processedStats;
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

export function ClubStrikeView(props: ClubStrikeViewProps) {
  const logic = useClubStrikeLogic(props);
  const { selectedRounds } = useRoundSelection();

  const formatStrikeCell = (count: number, total: number) => {
    if (total === 0) return "0";
    if (count === 0) return "0";
    const percentage = Math.round((count / total) * 100);
    return `${count} (${percentage}%)`;
  };

  return (
    <Container>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text variant="heading">Club Strike</Text>
        <Button variant="outline" onClick={logic.openModal}>
          Select Rounds ({selectedRounds.length})
        </Button>
      </Flex>

      {selectedRounds.length === 0 ? (
        <Text>Select rounds to view statistics</Text>
      ) : Object.keys(logic.stats).length === 0 ? (
        <Text>No stroke data available for selected rounds</Text>
      ) : (
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Club</Th>
              {STRIKE_COLUMNS.map(strike => (
                <Th key={strike}>{strike}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(logic.stats).map(([club, data]) => {
              const clubData = data as { strikes: Record<Strike, number>; total: number };
              return (
                <Tr key={club}>
                  <Td>{club}</Td>
                  {STRIKE_COLUMNS.map(strike => (
                    <Td key={strike}>
                      {formatStrikeCell(clubData.strikes[strike] || 0, clubData.total)}
                    </Td>
                  ))}
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