import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { StrokeCounter } from "./StrokeCounter.view";

const MIN_DIST_FOR_RESULT_TEXT = 270;

type HoleOverviewProps = {
  holeNum: number;
  holeLength: number | undefined;
  par: number | undefined;
  currentStrokeNum: number;
  distanceToHole: number | undefined;
  holeAltitudeDelta: number | undefined;
  roundScore: number | undefined;
  windDirection?: number | undefined;
  windSpeed?: number | undefined;
  weather?: string | undefined;
  activeStroke: number;
  setActiveStroke: (stroke: number) => void;
  distanceUnit: string;
  nextHole: (() => void) | null;
  prevHole: (() => void) | null;
  setPar: (par: number) => void;
};

export function HoleOverview(props: HoleOverviewProps) {
  // todo: move to logic hook
  const roundScoreBg =
    props.roundScore === undefined
      ? "black"
      : props.roundScore > 0
      ? "#c00000"
      : props.roundScore < 0
      ? "black"
      : "neutral.800";

  // todo: make relative to player's max strike, and lie - i.e. tee / other
  // todo: hide this if hole finished
  // bug!: this should be based on fromPos of activeStroke to hole, not currentPosition
  const forScoreOutcomeDescription =
    !props.par ||
    (props.distanceToHole !== undefined &&
      props.distanceToHole > MIN_DIST_FOR_RESULT_TEXT)
      ? undefined
      : props.currentStrokeNum === props.par - 2
      ? "eagle"
      : props.currentStrokeNum === props.par - 1
      ? "birdie"
      : props.currentStrokeNum === props.par
      ? "par"
      : props.currentStrokeNum === props.par + 1
      ? "bogey"
      : props.currentStrokeNum === props.par + 2
      ? "double bogey"
      : props.currentStrokeNum === props.par + 3
      ? "triple bogey"
      : props.currentStrokeNum >= props.par
      ? `${props.currentStrokeNum - props.par}× bogey`
      : undefined;

  return (
    <Box borderBottom="1px solid" borderColor="neutral.500">
      <Flex justifyContent="stretch" alignItems="stretch" bgColor="white">
        <Flex width="3rem"></Flex>
        <Flex
          py={1}
          px={2}
          flexDir="row"
          alignItems={"center"}
          justifyContent={"center"}
          flexGrow={1}
        >
          {props.prevHole ? (
            <Button variant="ghost" onClick={props.prevHole}>
              <ChevronLeftIcon boxSize={6} />
            </Button>
          ) : (
            <Box width="3rem"></Box>
          )}
          <Text variant="heading" color="black" pr={2}>
            {props.holeNum}
          </Text>
          <Flex flexDir={"column"} color={"neutral.800"}>
            <Button variant="ghost" p={0} height="auto" position="relative">
              <select
                onChange={(e) => {
                  const parNum = parseInt(e.target.value, 10);
                  if (parNum) props.setPar(parNum);
                }}
                value={props.par}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
              >
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
              <Text variant="minor" lineHeight={"1.1em"} fontWeight={800}>
                {props.par ? `Par ${props.par}` : "Set Par"}
              </Text>
            </Button>
            {props.holeLength && (
              <Text variant="minor" lineHeight={"1.1em"} fontWeight={800}>
                {Math.round(props.holeLength)}
                {props.distanceUnit}
              </Text>
            )}
          </Flex>
          {props.nextHole ? (
            <Button variant="ghost" onClick={props.nextHole}>
              <ChevronRightIcon boxSize={6} />
            </Button>
          ) : (
            <Box width="3rem"></Box>
          )}
        </Flex>
        {props.roundScore !== undefined && (
          <Flex
            bgColor={roundScoreBg}
            justifyContent="center"
            alignItems="center"
            width="3rem"
          >
            <Text variant="heading" color="white">
              {props.roundScore > 0 ? "+" : props.roundScore < 0 ? "-" : ""}
              {props.roundScore === 0 ? "E" : Math.abs(props.roundScore)}
            </Text>
          </Flex>
        )}
      </Flex>
      <Flex
        justifyContent="space-between"
        alignItems={"stretch"}
        bgColor="panel.700"
        py={2}
        px={4}
      >
        <Flex flexDir={"column"}>
          <StrokeCounter
            par={props.par}
            activeStroke={props.activeStroke}
            totalStrokes={props.currentStrokeNum}
            strokeClick={props.setActiveStroke}
          />
          <Text color="white" variant="solidLabel" mt={2} lineHeight="1em">
            {forScoreOutcomeDescription && (
              <>For {forScoreOutcomeDescription}</>
            )}
            &nbsp;
          </Text>
        </Flex>
        <Flex flexDir={"column"} alignItems={"flex-end"}>
          {props.distanceToHole && (
            <Flex pt={1}>
              <Text color="white" variant="solidLabel" mr={1}>
                To hole
              </Text>
              <Text variant="heading2" color="white" lineHeight={"1em"}>
                {Math.round(props.distanceToHole)}
                {props.distanceUnit}
              </Text>
            </Flex>
          )}
          {!props.holeLength && (
            <Button variant="ghost" p={0}>
              <Text variant="minor" lineHeight="1.1em" fontWeight={800}>
                Set Pin
              </Text>
            </Button>
          )}
          {/* Todo: Wind */}
        </Flex>
      </Flex>
    </Box>
  );
}
