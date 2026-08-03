import { useCallback, useEffect, useState } from "react";
import { Button, Flex, Text, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Hole as HoleModel } from "model/Hole";
import { Lie } from "model/Lie";
import { useInput } from "presenters/utils/useInput/useInput";
import { Club } from "model/Club";
import { StrokeWithDerivedFields } from "model/Stroke";
import { LatLng } from "model/LatLng";
import { Container, StrokesContainer } from "./Hole.styles";
import { HoleOverview } from "./components/HoleOverview/HoleOverview.view";
import { Strike } from "model/Strike";
import { StrokeType } from "model/StrokeType";
import { Penalty } from "model/Penalty";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";
import { SingleStroke } from "./components/SingleStroke";
import { PosOptionMethods } from "model/PosOptions";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { RoutePaths } from "presenters/routes/RoutePaths";
import { Course } from "model/Course";
import { ClubStats } from "model/ClubStats";
import { ordinalIndicator } from "presenters/utils/ordinalIndicator";
import { FullScreenMap } from "./components/FullScreenMap.view";
import { ScorecardPanel } from "./components/ScorecardPanel.view";

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
  selectStrike: (stroke: number, strike: Strike) => void;
  selectPenalty: (stroke: number, penalty: Penalty | undefined) => void;
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
  gpsAccuracy: number | undefined;
  saveRound: (course: Course) => void;
  resetCourse: () => void;
  clubStats: ClubStats;
  finishRound: () => void;
  holeNote: string;
  saveHoleNote: (note: string) => void;
};

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

  const { holeNote, saveHoleNote } = props;
  const [noteValue, setNoteValue] = useState(holeNote);
  useEffect(
    function syncNoteOnHoleChange() {
      setNoteValue(holeNote);
    },
    // reset the editable value whenever we navigate to a different hole
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.holeNum]
  );
  const saveNote = useCallback(() => {
    if (noteValue !== holeNote) {
      saveHoleNote(noteValue);
    }
  }, [noteValue, holeNote, saveHoleNote]);

  const [showFullScreenMap, setShowFullScreenMap] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);

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
  const [showLeavingPrompt, setShowLeavingPrompt] = useState(false);
  const promptOnLeave = useCallback(() => setShowLeavingPrompt(true), []);
  const cancelLeave = useCallback(() => setShowLeavingPrompt(false), []);

  return {
    par,
    parInputProps,
    showFullScreenMap,
    openFullScreenMap: useCallback(() => setShowFullScreenMap(true), []),
    closeFullScreenMap: useCallback(() => setShowFullScreenMap(false), []),
    showScorecard,
    openScorecard: useCallback(() => setShowScorecard(true), []),
    closeScorecard: useCallback(() => setShowScorecard(false), []),
    setToPosition,
    setFromPosition,
    activeStroke: availableActiveStroke,
    setActiveStroke,
    navHome,
    showLeavingPrompt,
    promptOnLeave,
    cancelLeave,
    saveAndNavHome,
    noteValue,
    setNoteValue,
    saveNote,
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
      {viewLogic.showLeavingPrompt ? (
        <Flex px={4} py={3}>
          <Flex flexDir="column" width="100%" rowGap={5}>
            <Text>Are you sure you want to leave?</Text>

            <Flex columnGap={3}>
              <Button
                flex={1}
                variant="primary"
                onClick={viewLogic.saveAndNavHome}
              >
                Save and leave
              </Button>
              <Button
                flex={1}
                variant="primaryOutline"
                onClick={viewLogic.navHome}
              >
                Discard round
              </Button>
            </Flex>
            <hr />
            <Box textAlign="center">
              <Button variant="link" onClick={viewLogic.cancelLeave}>
                Back to round
              </Button>
            </Box>
          </Flex>
        </Flex>
      ) : (
        <Box flex={1} overflowY="auto" maxHeight="100%" p={4}>
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
                strokes={props.preprocessedStrokes}
                distanceToHole={props.distanceToHole}
                holeAltitudeDelta={props.holeAltitudeDelta}
                holeLength={props.holeLength}
                par={props.par}
                roundScore={props.roundScore}
                activeStroke={viewLogic.activeStroke}
                setActiveStroke={viewLogic.setActiveStroke}
                distanceUnit={distanceUnit}
                leaveRound={viewLogic.promptOnLeave}
                showScorecard={viewLogic.openScorecard}
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
                selectStrike={props.selectStrike}
                selectPenalty={props.selectPenalty}
                setFromPosition={viewLogic.setFromPosition}
                setToPosition={viewLogic.setToPosition}
                setFromPosMethod={props.setFromPosMethod}
                setToPosMethod={props.setToPosMethod}
                distanceUnit={distanceUnit}
                currentPosition={props.currentPosition}
                gpsAccuracy={props.gpsAccuracy}
                showFullScreenMap={viewLogic.openFullScreenMap}
                clubStats={props.clubStats}
                holeNote={viewLogic.noteValue}
                setHoleNote={viewLogic.setNoteValue}
                saveHoleNote={viewLogic.saveNote}
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
                  variant={props.hole.holeNum > 1 ? "ghost" : "disabledGhost"}
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
                        : viewLogic.setActiveStroke(viewLogic.activeStroke + 1);
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
        </Box>
      )}
      {viewLogic.showFullScreenMap && (
        <FullScreenMap
          hole={props.hole}
          currentPosition={props.currentPosition}
          gpsAccuracy={props.gpsAccuracy}
          parInputProps={viewLogic.parInputProps}
          setTeePos={props.setTeePos}
          setHolePos={props.setHolePos}
          onClose={viewLogic.closeFullScreenMap}
        />
      )}
      {viewLogic.showScorecard && (
        <ScorecardPanel
          course={props.course}
          onClose={viewLogic.closeScorecard}
        />
      )}
    </Container>
  );
}
