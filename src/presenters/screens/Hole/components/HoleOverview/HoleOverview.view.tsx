import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

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
};

function StrokesCount({
  par,
  activeStroke,
  totalStrokes,
  strokeClick,
}: {
  par: number | undefined;
  activeStroke: number;
  totalStrokes: number;
  strokeClick: (stroke: number) => void;
}) {
  const sz = "32"; // size
  const numStrokesToShow = Math.max(par || 1, totalStrokes);
  const strokes = Array(isNaN(numStrokesToShow) ? par : numStrokesToShow)
    .fill(0)
    .map((_, i) => i + 1)
    .slice(-6);
  // todo: consider activeStroke, if user is scrolling back through
  return (
    <Flex>
      {strokes.map((n, i) => (
        <Button
          variant="ghost"
          onClick={() => strokeClick(n)}
          p={0}
          minWidth={`${sz}px`}
          height={`${sz}px`}
        >
          <Text
            key={n}
            display="inline-flex"
            justifyContent="center"
            alignItems="center"
            fontWeight="600"
            minWidth={`${sz}px`}
            height={`${sz}px`}
            bgColor={
              n === activeStroke
                ? "white"
                : n === totalStrokes
                ? "primary.500"
                : "transparent"
            }
            color={
              n === activeStroke
                ? "primary.200"
                : n === totalStrokes
                ? "primary.200"
                : "white"
            }
            border={`1px solid`}
            borderColor="white"
            borderRight={i !== strokes.length - 1 ? "none" : undefined}
          >
            {strokes.length < numStrokesToShow && i === 0 ? "-" : n}
          </Text>
        </Button>
      ))}
    </Flex>
  );
}

export function HoleOverview(props: HoleOverviewProps) {
  const distUnit = "m"; // todo

  const roundScoreBg =
    props.roundScore === undefined
      ? "black"
      : props.roundScore > 0
      ? "#ff0000"
      : props.roundScore < 0
      ? "black"
      : "neutral.800";

  const forScoreOutcomeDescription = !props.par
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
      <Flex justifyContent="stretch" bgColor="white">
        <Flex width="3rem">{/* Spacer */}</Flex>
        <Flex
          py={1}
          px={2}
          flexDir="row"
          alignItems={"center"}
          justifyContent={"center"}
          flexGrow={1}
        >
          <Button variant="ghost">
            <ChevronLeftIcon boxSize={6} />
          </Button>
          <Text variant="heading" color="black" pr={2}>
            {props.holeNum}
          </Text>
          <Flex flexDir={"column"} color={"neutral.800"}>
            {props.par && (
              <Text variant="minor" lineHeight={"1.1em"} fontWeight={800}>
                Par {props.par}
              </Text>
            )}
            {props.holeLength && (
              <Text variant="minor" lineHeight={"1.1em"} fontWeight={800}>
                {Math.round(props.holeLength)}
                {distUnit}
              </Text>
            )}
          </Flex>
          <Button variant="ghost">
            <ChevronRightIcon boxSize={6} />
          </Button>
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
              {props.roundScore === 0 ? "E" : props.roundScore}
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
          <StrokesCount
            par={props.par}
            activeStroke={props.activeStroke}
            totalStrokes={props.currentStrokeNum}
            strokeClick={props.setActiveStroke}
          />
          <Text color="white" variant="solidLabel" mt={1} lineHeight="1em">
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
                {distUnit}
              </Text>
            </Flex>
          )}
          {/* Todo: Wind */}
        </Flex>
      </Flex>
    </Box>
  );
}
