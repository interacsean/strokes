import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormLabel,
  Input,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Checkbox,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Hole as HoleModel } from "model/Hole";
import { Lie } from "model/Lie";
import { useInput } from "presenters/utils/useInput/useInput";
import { Club } from "model/Club";
import { StrokeWithDerivedFields } from "model/Stroke";
import { LatLng } from "model/LatLng";
import { Container, StrokesContainer } from "./Hole.styles";
import { HoleOverview } from "./components/HoleOverview/HoleOverview.view";
import { StrokeType } from "model/StrokeType";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";
import { SingleStroke } from "./components/SingleStroke";
import { PosOptionMethods } from "model/PosOptions";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { RoutePaths } from "presenters/routes/RoutePaths";
import { copyToClipboard } from "usecases/device/copyToClipboard";
import { Course } from "model/Course";
import Map from "presenters/components/Map/Map";
import { ClubStats } from "model/ClubStats";
import { ScoreCard } from "../../components/Scorecard/ScoreCard.view";
import { ordinalIndicator } from "presenters/utils/ordinalIndicator";

export type HoleViewProps = {
  holeNum: number;
  hole: HoleModel;
  par: number | undefined;
  currentPosition: LatLng | undefined;
  nextHole: () => void;
  prevHole: () => void;
  setPar: (n: number) => void;
  selectStrokeFromLie: (stroke: number, lie: Lie | string) => void;
  selectStrokeToLie: (stroke: number, lie: Lie) => void;
  setFromPosMethod: (stroke: number, posMethod: PosOptionMethods) => void;
  setToPosMethod: (stroke: number, posMethod: PosOptionMethods) => void;
  selectStrokeClub: (stroke: number, club: Club) => void;
  selectStrokeType: (stroke: number, strokeType: StrokeType) => void;
  preprocessedStrokes: StrokeWithDerivedFields[];
  setFromPosition: (stroke: number, pos: LatLng) => void;
  setToPosition: (stroke: number, pos: LatLng) => void;
  setHolePos: (pos: LatLng) => void;
  setTeePos: (teeName: string, pos: LatLng) => void;
  addStroke: () => void;
  distanceToHole: number | undefined;
  holeAltitudeDelta: number | undefined;
  roundScore: number;
  holeLength: number | undefined;
  course: Course;
  gpsComponent: React.ReactNode;
  saveRound: (course: Course) => void;
  resetCourse: () => void;
  clubStats: ClubStats;
  finishRound: () => void;
};

const DEFAULT_HOLE_TAB = 1;

function useHoleViewLogic(props: HoleViewProps) {
  const {
    setPar,
    currentPosition,
    setToPosition: parentSetToPosition,
    setFromPosition: parentSetFromPosition,
    course,
    saveRound,
  } = props;
  // const pinPlayed = selectCurrentPinFromHole(props.hole);
  const [activeStroke, setActiveStroke] = useState(1);

  useEffect(
    function goToLastStrokeOnAdd() {
      setActiveStroke(props.preprocessedStrokes.length || 1);
    },
    [props.preprocessedStrokes.length]
  );

  const teePlayed = selectCurrentTeeFromHole(props.hole);
  const par = teePlayed?.par;
  const { inputProps: parInputProps, setCurrentValue: setParInputValue } =
    useInput({
      initValue: `${par}`,
      onBlur: useCallback(
        (value: string) => {
          const newPar = parseInt(value, 10);
          if (!isNaN(newPar)) {
            setPar(newPar);
          }
        },
        [setPar]
      ),
    });
  useEffect(
    function updateParInputValueOnHoleUpdate() {
      setParInputValue(`${par}`);
    },
    [setParInputValue, props.holeNum, par]
  );

  const setToPosition = useCallback(
    (strokeNum: number, optionalPos?: LatLng) => {
      if (optionalPos) {
        return parentSetToPosition(strokeNum, optionalPos);
      }
      currentPosition && parentSetToPosition(strokeNum, currentPosition);
    },
    [currentPosition, parentSetToPosition]
  );

  const setFromPosition = useCallback(
    (strokeNum: number, optionalPos?: LatLng) => {
      if (optionalPos) {
        return parentSetFromPosition(strokeNum, optionalPos);
      }
      currentPosition && parentSetFromPosition(strokeNum, currentPosition);
    },
    [currentPosition, parentSetFromPosition]
  );

  const [tabIndex, setTabIndex] = useState(DEFAULT_HOLE_TAB);

  const availableActiveStroke =
    props.preprocessedStrokes[activeStroke - 1] === undefined
      ? 1
      : activeStroke;

  const navigate = useNavigate();
  const navHome = useCallback(() => navigate(RoutePaths.Home), [navigate]);
  const saveAndNavHome = useCallback(() => {
    saveRound(course);
    navHome();
  }, [navHome, saveRound, course]);
  const [saveRoundData, setSaveRoundData] = useState(true);
  const handleLeaveClick = useCallback(() => {
    if (saveRoundData) {
      saveAndNavHome();
    } else {
      navHome();
    }
  }, [saveRoundData, saveAndNavHome, navHome]);

  const [showLeavingPrompt, setShowLeavingPrompt] = useState(false);
  const promptOnLeave = useCallback(() => setShowLeavingPrompt(true), []);
  const cancelLeave = useCallback(() => setShowLeavingPrompt(false), []);

  return {
    par,
    parInputProps,
    tabIndex,
    setTabIndex,
    switchViewMap: useCallback(() => setTabIndex(0), [setTabIndex]),
    switchViewStrokeList: useCallback(() => setTabIndex(1), [setTabIndex]),
    setToPosition,
    setFromPosition,
    activeStroke: availableActiveStroke,
    setActiveStroke,
    navHome,
    showLeavingPrompt,
    promptOnLeave,
    cancelLeave,
    saveAndNavHome,
    setSaveRoundData,
    handleLeaveClick,
  };
}

const DEBUG = true;

export function HoleView(props: HoleViewProps) {
  const distanceUnit = "m"; // todo
  const viewLogic = useHoleViewLogic(props);
  if (DEBUG) console.log({ props, viewLogic });

  const currentStroke = props.preprocessedStrokes[viewLogic.activeStroke - 1];
  const nextStrokeIsToAdd =
    viewLogic.activeStroke === props.preprocessedStrokes.length;
  const canMoveNextStroke =
    currentStroke.toPos &&
    currentStroke.toLie &&
    currentStroke.toPosSetMethod !== PosOptionMethods.HOLE;
  const canMovePrevStroke = viewLogic.activeStroke > 1;
  const timeForNextHole = props.preprocessedStrokes[props.preprocessedStrokes.length - 1]
      .toPosSetMethod === PosOptionMethods.HOLE;
  const canFinish = timeForNextHole &&
    props.hole.holeNum === props.course.holes.length;
    
  return (
    <Container>
      <Tabs
        index={viewLogic.tabIndex}
        onChange={viewLogic.setTabIndex}
        flex={1}
        display="flex"
        flexDir="column"
        alignItems="stretch"
        maxHeight="100%"
      >
        <Flex>
          <TabList flex={1}>
            <Tab onClick={() => viewLogic.setTabIndex(0)}>Map</Tab>
            <Tab onClick={() => viewLogic.setTabIndex(1)}>Strokes</Tab>
            <Tab onClick={() => viewLogic.setTabIndex(2)}>Scorecard</Tab>
          </TabList>
          <Button variant="ghost" onClick={viewLogic.promptOnLeave} px={0}>
            <CloseIcon boxSize={4} />
          </Button>
        </Flex>
        {viewLogic.showLeavingPrompt ? (
          <Flex px={4} py={3}>
            <Flex flexDir="column" width="100%" rowGap={5}>
              <Text>Are you sure you want to leave?</Text>

              <Checkbox
                defaultChecked
                onChange={(e) => viewLogic.setSaveRoundData(e.target.checked)}
              >
                Save round data
              </Checkbox>

              <Box>
                <Button
                  flex={1}
                  variant="primary"
                  onClick={viewLogic.handleLeaveClick}
                  width="100%"
                >
                  Leave
                </Button>
              </Box>
              <hr />
              <Box>
                <Button
                  flex={1}
                  variant="outline"
                  onClick={viewLogic.cancelLeave}
                  width="100%"
                >
                  Back to round
                </Button>
              </Box>
            </Flex>
          </Flex>
        ) : (
          <TabPanels flex={1} overflowY="auto" maxHeight="100%">
            <TabPanel height="100%" p={0}>
              {/* todo: does not work if window.google.maps is undefined */}
              <Box height="100%">
                {props.currentPosition ? (
                  <Map
                    tilt={52}
                    ballPos={null}
                    zoomFactor={2}
                    hole={props.hole}
                    currentPosition={props.currentPosition}
                  />
                ) : (
                  "Loading map"
                )}
              </Box>
              <Box>
                <Box>
                  <FormLabel>
                    <Text>Set tee pos</Text>
                    <Button
                      variant="primaryOutline"
                      onClick={() =>
                        props.currentPosition &&
                        props.setTeePos("default", props.currentPosition)
                      }
                    >
                      📍⛳️
                    </Button>
                  </FormLabel>
                  <FormLabel>
                    <Text>Par {props.par}</Text>
                    <Input name="par" {...viewLogic.parInputProps} />
                  </FormLabel>
                  <FormLabel>
                    <Text>Set hole pos</Text>
                    <Button
                      variant="primaryOutline"
                      onClick={() =>
                        props.currentPosition &&
                        props.setHolePos(props.currentPosition)
                      }
                    >
                      📍⛳️
                    </Button>
                  </FormLabel>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel height="100%">
              {/* Strokes */}
              <StrokesContainer>
                <Box
                  mx={-4}
                  mt={-4}
                  boxShadow="0 2px 4px rgba(0, 0, 0, 0.4)"
                  zIndex={10}
                  position="relative"
                >
                  <HoleOverview
                    setPar={props.setPar}
                    nextHole={
                      props.course.currentHoleNum === props.course.holes.length
                        ? null
                        : props.nextHole
                    }
                    prevHole={props.prevHole}
                    holeNum={props.holeNum}
                    currentStrokeNum={props.preprocessedStrokes.length}
                    distanceToHole={props.distanceToHole}
                    holeAltitudeDelta={props.holeAltitudeDelta}
                    holeLength={props.holeLength}
                    par={props.par}
                    roundScore={props.roundScore}
                    activeStroke={viewLogic.activeStroke}
                    setActiveStroke={viewLogic.setActiveStroke}
                    distanceUnit={distanceUnit}
                  />
                </Box>
                <Box position="relative" flex={1} zIndex={9}>
                  <SingleStroke
                    hole={props.hole}
                    strokeNum={viewLogic.activeStroke}
                    stroke={currentStroke}
                    strokes={props.preprocessedStrokes}
                    selectFromLie={props.selectStrokeFromLie}
                    selectToLie={props.selectStrokeToLie}
                    selectClub={props.selectStrokeClub}
                    selectStrokeType={props.selectStrokeType}
                    setFromPosition={viewLogic.setFromPosition}
                    setToPosition={viewLogic.setToPosition}
                    setFromPosMethod={props.setFromPosMethod}
                    setToPosMethod={props.setToPosMethod}
                    distanceUnit={distanceUnit}
                    currentPosition={props.currentPosition}
                    clubStats={props.clubStats}
                  />
                </Box>

                <Flex
                  columnGap={2}
                  mx={-4}
                  justifyContent="stretch"
                  alignItems="center"
                  boxShadow="0 -2px 4px rgba(0, 0, 0, 0.1)"
                >
                  <Flex flex={1} justifyContent={"space-between"} columnGap={2}>
                    <Button
                      variant={
                        props.hole.holeNum > 1 ? "ghost" : "disabledGhost"
                      }
                      px={2.5}
                      onClick={props.prevHole}
                    >
                      <ChevronLeftIcon boxSize={6} />
                      {props.hole.holeNum > 1 && (
                        <>
                          {props.hole.holeNum - 1}
                          {ordinalIndicator(props.hole.holeNum - 1)}
                        </>
                      )}
                    </Button>
                    <Button
                      variant={!canMovePrevStroke ? "disabledGhost" : "ghost"}
                      disabled={!canMovePrevStroke}
                      px={2}
                      onClick={() =>
                        canMovePrevStroke &&
                        viewLogic.setActiveStroke(viewLogic.activeStroke - 1)
                      }
                    >
                      <ChevronLeftIcon boxSize={6} />
                    </Button>
                  </Flex>
                  <Flex
                    flex={0}
                    justifyContent={"flex-center"}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <Text mx={2}>Shot {viewLogic.activeStroke}</Text>
                  </Flex>
                  <Flex flex={1} justifyContent={"space-between"}>
                    <Button
                      disabled={!canMoveNextStroke}
                      variant={
                        !canMoveNextStroke
                          ? "disabledGhost"
                          : nextStrokeIsToAdd
                          ? "primary"
                          : "ghost"
                      }
                      px={2}
                      onClick={() => {
                        if (canMoveNextStroke) {
                          viewLogic.activeStroke ===
                          props.preprocessedStrokes.length
                            ? props.addStroke()
                            : viewLogic.setActiveStroke(
                                viewLogic.activeStroke + 1
                              );
                        }
                      }}
                    >
                      {nextStrokeIsToAdd && canMoveNextStroke ? (
                        "Next"
                      ) : (
                        <ChevronRightIcon boxSize={6} />
                      )}
                    </Button>
                    {props.hole.holeNum === props.course.holes.length ? (
                      <Button
                        variant={canFinish ? "primary" : "disabledGhost"}
                        px={3}
                        mr={2}
                        onClick={canFinish ? props.finishRound : undefined}
                      >
                        Finish
                      </Button>
                    ) : (
                      <Button
                        variant={timeForNextHole ? "primary" : "ghost"}
                        pl={2.5}
                        pr={1.5}
                        mr={2.5}
                        onClick={props.nextHole}
                      >
                        {props.hole.holeNum + 1}
                        {ordinalIndicator(props.hole.holeNum + 1)}
                        <ChevronRightIcon boxSize={6} />
                      </Button>
                    )}
                  </Flex>
                </Flex>
              </StrokesContainer>
            </TabPanel>
            <TabPanel flex={1}>
              {/* Scorecard */}
              <Flex flexDir="column">
                <ScoreCard round={props.course} />
                <h4>Export</h4>
                <Text>
                  Copy the JSON data of your current course + round, for
                  external use and analysis.
                </Text>
                <Button
                  onClick={() => copyToClipboard(JSON.stringify(props.course))}
                >
                  Copy round
                </Button>
              </Flex>
            </TabPanel>
          </TabPanels>
        )}
        {props.gpsComponent}
      </Tabs>
    </Container>
  );
}
