import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { ReactNode } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import { Stroke } from "model/Stroke";
import { strokeNumberWithPenalties } from "usecases/hole/calculateHoleScore";
import { StrokeCounter } from "./StrokeCounter.view";
import { ParSelect } from "./ParSelect.view";
import { HoleMarker } from "../FullScreenMap.view";

const MIN_DIST_FOR_RESULT_TEXT = 270;

type HoleOverviewProps = {
  holeNum: number;
  holeLength: number | undefined;
  par: number | undefined;
  strokes: Stroke[];
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
  leaveRound: () => void;
  showScorecard: () => void;
  /** Whether each end of the hole is on the map yet. A course set up on the
   * fly starts with neither. */
  hasTee: boolean;
  hasPin: boolean;
  placeMarker: (marker: HoleMarker) => void;
};

/** Small enough to sit under a reading without pushing the bar any taller. */
const OUTLINE_BUTTON_PROPS = {
  variant: "unstyled",
  display: "inline-flex",
  alignItems: "center",
  height: "auto",
  minW: "auto",
  px: 2,
  py: 0.5,
  borderWidth: "1px",
  borderRadius: "md",
  fontSize: "xs",
  fontWeight: 700,
} as const;

/** A quiet way in to change something that is already set. */
function PanelLink({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      variant="unstyled"
      height="auto"
      minW="auto"
      p={0}
      fontSize="xs"
      fontWeight={600}
      color="white"
      textDecoration="underline"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

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

  // What the player cards by holing the stroke on screen — its golf stroke
  // number. Counted off the stroke index rather than any outcome field, since
  // club, lie and position are all filled in piecemeal while a shot is recorded.
  const strokesForScore = strokeNumberWithPenalties(
    props.strokes,
    props.activeStroke
  );

  // todo: make relative to player's max strike, and lie - i.e. tee / other
  // todo: hide this if hole finished
  // bug!: this should be based on fromPos of activeStroke to hole, not currentPosition
  const forScoreOutcomeDescription =
    !props.par ||
    (props.distanceToHole !== undefined &&
      props.distanceToHole > MIN_DIST_FOR_RESULT_TEXT)
      ? undefined
      : strokesForScore === props.par - 2
      ? "eagle"
      : strokesForScore === props.par - 1
      ? "birdie"
      : strokesForScore === props.par
      ? "par"
      : strokesForScore === props.par + 1
      ? "bogey"
      : strokesForScore === props.par + 2
      ? "double bogey"
      : strokesForScore === props.par + 3
      ? "triple bogey"
      : strokesForScore >= props.par
      ? `${strokesForScore - props.par}× bogey`
      : undefined;

  return (
    <Box borderBottom="1px solid" borderColor="neutral.500">
      <Flex justifyContent="stretch" alignItems="stretch" bgColor="white">
        <Flex width="3rem" alignItems="center" justifyContent="center">
          <Button
            aria-label="Leave round"
            variant="ghost"
            px={0}
            minWidth="auto"
            onClick={props.leaveRound}
          >
            <CloseIcon boxSize={4} />
          </Button>
        </Flex>
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
          <Flex
            flexDir={"column"}
            alignItems="flex-start"
            rowGap={0.5}
            color={"neutral.800"}
          >
            {/* Without a pin there is no hole length to go with it, and the
                par on its own over "Set tee" is just clutter. */}
            {props.par && props.hasPin && (
              <Text variant="minor" lineHeight={"1.1em"} fontWeight={800}>
                Par {props.par}
              </Text>
            )}
            {!props.hasTee ? (
              <Button
                {...OUTLINE_BUTTON_PROPS}
                borderColor="primary.500"
                color="primary.500"
                onClick={() => props.placeMarker("tee")}
              >
                Set tee
              </Button>
            ) : (
              <Button
                variant="unstyled"
                aria-label="Edit tee"
                height="auto"
                minW="auto"
                p={0}
                onClick={() => props.placeMarker("tee")}
              >
                <Text
                  variant="minor"
                  lineHeight={"1.1em"}
                  fontWeight={800}
                  textDecoration="underline"
                >
                  {props.holeLength
                    ? `${Math.round(props.holeLength)}${props.distanceUnit}`
                    : "Edit tee"}
                </Text>
              </Button>
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
            as="button"
            type="button"
            aria-label="Show scorecard"
            onClick={props.showScorecard}
            bgColor={roundScoreBg}
            justifyContent="center"
            alignItems="center"
            width="3rem"
            _active={{ opacity: 0.6 }}
          >
            <Text
              variant="heading"
              color="white"
              lineHeight="1.15em"
              borderBottom="1px dotted currentColor"
            >
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
            strokes={props.strokes}
            strokeClick={props.setActiveStroke}
          >
            {!props.par && (
              <ParSelect par={props.par} setPar={props.setPar}>
                <Button
                  as="span"
                  {...OUTLINE_BUTTON_PROPS}
                  ml={2}
                  borderColor="white"
                  color="white"
                >
                  Set par
                </Button>
              </ParSelect>
            )}
          </StrokeCounter>
          {/* Holds its height with nothing in it, so the bar doesn't jump. */}
          <Flex mt={2} minH="1em" columnGap={3} alignItems="center">
            {forScoreOutcomeDescription && (
              <Text color="white" variant="solidLabel" lineHeight="1em">
                For {forScoreOutcomeDescription}
              </Text>
            )}
            {props.par && (
              <ParSelect par={props.par} setPar={props.setPar}>
                <PanelLink>Edit par</PanelLink>
              </ParSelect>
            )}
          </Flex>
        </Flex>
        <Flex flexDir={"column"} alignItems={"flex-end"} rowGap={1}>
          <Flex pt={1} alignItems="center">
            <Text color="white" variant="solidLabel" mr={1}>
              To hole
            </Text>
            {!props.hasPin ? (
              <Button
                {...OUTLINE_BUTTON_PROPS}
                borderColor="white"
                color="white"
                onClick={() => props.placeMarker("pin")}
              >
                Set pin
              </Button>
            ) : (
              <Text variant="heading2" color="white" lineHeight={"1em"}>
                {props.distanceToHole !== undefined
                  ? `${Math.round(props.distanceToHole)}${props.distanceUnit}`
                  : "–"}
              </Text>
            )}
          </Flex>
          {props.hasPin && (
            <PanelLink onClick={() => props.placeMarker("pin")}>
              Edit pin
            </PanelLink>
          )}
          {/* Todo: Wind */}
        </Flex>
      </Flex>
    </Box>
  );
}
