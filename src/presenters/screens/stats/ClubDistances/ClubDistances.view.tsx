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
  Box,
  Checkbox,
  Stack,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import { Course } from "model/Course";
import { Club } from "model/Club";
import { Strike, StrikeLabels } from "model/Strike";
import { StrokeType, StrokeTypeLabels } from "model/StrokeType";
import { useMemo, useState } from "react";
import { RoundSelectionModal } from "../components/RoundSelectionModal";
import { useRoundSelection } from "../components/RoundSelectionProvider";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";
import { ModalContainer } from "presenters/components/Modal/Modal";

export type ClubDistancesViewProps = {
  availableRounds: Course[];
};

const ALL_FULL_STROKE_TYPES = [
  StrokeType.FULL,
  StrokeType.LOW,
  StrokeType.LOW_FADE,
  StrokeType.LOW_DRAW,
  StrokeType.HIGH,
  StrokeType.HIGH_FADE,
  StrokeType.HIGH_DRAW,
  StrokeType.DRAW,
  StrokeType.FADE,
];

function calculatePercentile(values: number[], percentile: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  
  if (lower === upper) {
    return sorted[lower];
  }
  
  return sorted[lower] * (upper - index) + sorted[upper] * (index - lower);
}

function useClubDistancesLogic(props: ClubDistancesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStrikes, setSelectedStrikes] = useState<(Strike | 'ALL')[]>([Strike.Clean]);
  const [selectedStrokeTypes, setSelectedStrokeTypes] = useState<StrokeType[]>(ALL_FULL_STROKE_TYPES);
  const { selectedRounds } = useRoundSelection();

  const stats = useMemo(() => {
    if (selectedRounds.length === 0) return {};

    const clubStats: Record<Club, number[]> = {} as any;

    selectedRounds.forEach(round => {
      round.holes.forEach(hole => {
        hole.strokes.forEach((stroke, i) => {
          if (!stroke.club || !stroke.strike || !stroke.strokeType) {
            return;
          }

          if (!selectedStrikes.includes(stroke.strike) && !selectedStrikes.includes('ALL')) return;
          if (!selectedStrokeTypes.includes(stroke.strokeType)) return;

          // Calculate stroke distance
          const fromPos = stroke.fromPos || (i > 0 ? hole.strokes[i - 1]?.toPos : undefined);
          const toPos = stroke.toPos;
          
          if (!fromPos || !toPos) return;
          
          const strokeDistance = calculateDistanceBetweenPositions(fromPos, toPos);

          if (!clubStats[stroke.club]) {
            clubStats[stroke.club] = [];
          }

          clubStats[stroke.club].push(strokeDistance);
        });
      });
    });

    const processedStats: Record<Club, { avg: number; p33: number | null; p67: number | null; count: number } | null> = {} as any;

    Object.entries(clubStats).forEach(([club, distances]) => {
      const avg = distances.reduce((sum, d) => sum + d, 0) / distances.length;
      if (distances.length < 5) {
        processedStats[club as Club] = {
          avg: Math.round(avg),
          p33: null,
          p67: null,
          count: distances.length,
        };
      } else {
        const p33 = calculatePercentile(distances, 33);
        const p67 = calculatePercentile(distances, 67);
        
        // @ts-ignore this will be fine
        processedStats[club as Club] = {
          p33: Math.round(p33),
          p67: Math.round(p67),
          avg: Math.round(avg),
          count: distances.length,
        };
      }
    });

    return processedStats;
  }, [selectedRounds, selectedStrikes, selectedStrokeTypes]);

  const toggleStrike = (strike: Strike | 'ALL') => {
    setSelectedStrikes(prev => {
      if (prev.includes(strike)) {
        return prev.filter(s => s !== strike);
      } else {
        return [...prev, strike];
      }
    });
  };

  const toggleStrokeType = (strokeType: StrokeType) => {
    setSelectedStrokeTypes(prev => {
      if (prev.includes(strokeType)) {
        return prev.filter(s => s !== strokeType);
      } else {
        return [...prev, strokeType];
      }
    });
  };

  const toggleAllFull = () => {
    const hasAllFull = ALL_FULL_STROKE_TYPES.every(st => selectedStrokeTypes.includes(st));
    if (hasAllFull) {
      setSelectedStrokeTypes(prev => prev.filter(st => !ALL_FULL_STROKE_TYPES.includes(st)));
    } else {
      setSelectedStrokeTypes(prev => {
        const filtered = prev.filter(st => !ALL_FULL_STROKE_TYPES.includes(st));
        return [...filtered, ...ALL_FULL_STROKE_TYPES];
      });
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isAllFullSelected = ALL_FULL_STROKE_TYPES.every(st => selectedStrokeTypes.includes(st));

  return {
    stats,
    isModalOpen,
    openModal,
    closeModal,
    selectedStrikes,
    selectedStrokeTypes,
    toggleStrike,
    toggleStrokeType,
    toggleAllFull,
    isAllFullSelected,
  };
}

export function ClubDistancesView(props: ClubDistancesViewProps) {
  const logic = useClubDistancesLogic(props);
  const { selectedRounds } = useRoundSelection();

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
          <Text variant="heading">Club Distances</Text>
          <Button variant="outline" onClick={logic.openModal}>
            Select Rounds ({selectedRounds.length})
          </Button>
        </Flex>

        {selectedRounds.length === 0 ? (
          <Text>Select rounds to view statistics</Text>
        ) : (
          <>
            {/* Filters */}
            <Box mb={6}>
              <Text fontWeight="bold" mb={2}>Strike Quality</Text>
              <Wrap spacing={2} mb={4}>
                <Checkbox
                  isChecked={logic.selectedStrikes.includes('ALL')}
                  onChange={() => logic.toggleStrike('ALL')}
                >
                All
              </Checkbox>
                {Object.values(Strike).map(strike => (
                  <WrapItem key={strike}>
                    <Checkbox
                      isChecked={logic.selectedStrikes.includes(strike)}
                      onChange={() => logic.toggleStrike(strike)}
                    >
                      {StrikeLabels[strike]}
                    </Checkbox>
                  </WrapItem>
                ))}
              </Wrap>

              <Text fontWeight="bold" mb={2}>Stroke Type</Text>
              <Stack spacing={2}>
                <Checkbox
                  isChecked={logic.isAllFullSelected}
                  onChange={logic.toggleAllFull}
                  fontWeight="medium"
                >
                  All Full
                </Checkbox>
                <Wrap spacing={2} ml={4}>
                  {Object.values(StrokeType).map(strokeType => (
                    <WrapItem key={strokeType}>
                      <Checkbox
                        isChecked={logic.selectedStrokeTypes.includes(strokeType)}
                        onChange={() => logic.toggleStrokeType(strokeType)}
                        size="sm"
                      >
                        {StrokeTypeLabels[strokeType] || strokeType}
                      </Checkbox>
                    </WrapItem>
                  ))}
                </Wrap>
              </Stack>
            </Box>

            {/* Results Table */}
            {Object.keys(logic.stats).length === 0 ? (
              <Text>No data available for selected rounds and filters</Text>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Club</Th>
                    <Th>Avg</Th>
                    <Th>1 SD</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(logic.stats).map(([club, data]) => {
                    const clubData = data as { avg: number; p33: number; p67: number; count: number } | null;
                    return (
                      <Tr key={club}>
                        <Td>{club}</Td>
                        <Td>{clubData ? `${clubData.avg}m` : "N/A"}</Td>
                        <Td>{(clubData?.p33 || clubData?.p67) ?
                          `${clubData.p33}m/${clubData.p67}m` : "N/A"}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </>
        )}
      </Flex>
    </Box>
  );
}