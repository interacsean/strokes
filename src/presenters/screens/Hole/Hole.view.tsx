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
} from "@chakra-ui/react";
import { Hole as HoleModel } from "model/Hole";
import { Lie } from "model/Lie";
import { useInput } from "presenters/utils/useInput/useInput";
import { Club } from "model/Club";
import { StrokeWithDerivedFields } from "model/Stroke";
import { LatLng } from "model/LatLng";
import { CaddySuggestion } from "usecases/stroke/calculateCaddySuggestions";
import { Container, StrokesContainer } from "./Hole.styles";
import { HoleOverview } from "./components/HoleOverview/HoleOverview.view";
import { StrokeType } from "model/StrokeType";
// import { selectCurrentPinFromHole } from "state/course/selectors/currentPin";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";
import { SingleStroke } from "./components/SingleStroke";
import { PosOptionMethods } from "model/PosOptions";

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
  setLiePos: (stroke: number, pos: LatLng) => void;
  setStrokePos: (stroke: number, pos: LatLng) => void;
  caddySuggestions: CaddySuggestion[];
  setHolePos: (pos: LatLng) => void;
  setTeePos: (teeName: string, pos: LatLng) => void;
  addStroke: () => void;
  distanceToHole: number | undefined;
  holeAltitudeDelta: number | undefined;
  roundScore: number;
  holeLength: number | undefined;
  // holedStroke: () => void;
};

const DEFAULT_HOLE_TAB = 1;

function useHoleViewLogic(props: HoleViewProps) {
  const {
    setPar,
    currentPosition,
    setStrokePos: parentSetStrokePos,
    setLiePos: parentSetLiePos,
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

  const setStrokePosition = useCallback(
    (strokeNum: number) =>
      currentPosition && parentSetStrokePos(strokeNum, currentPosition),
    [currentPosition, parentSetStrokePos]
  );

  const setLiePosition = useCallback(
    // @ts-ignore
    (strokeNum: number) =>
      currentPosition && parentSetLiePos(strokeNum, currentPosition),
    [currentPosition, parentSetLiePos]
  );

  const [tabIndex, setTabIndex] = useState(DEFAULT_HOLE_TAB);

  const availableActiveStroke =
    props.preprocessedStrokes[activeStroke - 1] === undefined
      ? 1
      : activeStroke;

  return {
    par,
    parInputProps,
    tabIndex,
    setTabIndex,
    switchViewMap: useCallback(() => setTabIndex(0), [setTabIndex]),
    switchViewStrokeList: useCallback(() => setTabIndex(1), [setTabIndex]),
    setStrokePosition,
    setLiePosition,
    activeStroke: availableActiveStroke,
    setActiveStroke,
  };
}

const DEBUG = true;

export function HoleView(props: HoleViewProps) {
  const distanceUnit = "m"; // todo
  const viewLogic = useHoleViewLogic(props);
  if (DEBUG) console.log({ props, viewLogic });

  return (
    <Container>
      <Tabs index={viewLogic.tabIndex} onChange={viewLogic.setTabIndex}>
        <TabList>
          <Tab onClick={() => viewLogic.setTabIndex(0)}>Map</Tab>
          <Tab onClick={() => viewLogic.setTabIndex(1)}>Strokes</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
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
          </TabPanel>
          <TabPanel>
            <StrokesContainer>
              <Box mx={-4} mt={-4}>
                <HoleOverview
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
              <Box position="relative" flex={1}>
                <SingleStroke
                  hole={props.hole}
                  strokeNum={viewLogic.activeStroke}
                  stroke={props.preprocessedStrokes[viewLogic.activeStroke - 1]}
                  selectFromLie={props.selectStrokeFromLie}
                  selectToLie={props.selectStrokeToLie}
                  selectClub={props.selectStrokeClub}
                  selectStrokeType={props.selectStrokeType}
                  setLiePosition={viewLogic.setLiePosition}
                  setStrokePosition={viewLogic.setStrokePosition}
                  setFromPosMethod={props.setFromPosMethod}
                  setToPosMethod={props.setToPosMethod}
                  distanceUnit={distanceUnit}
                  currentPosition={props.currentPosition}
                />
              </Box>
              <hr />

              <Flex flexDir="column" rowGap={3} mt={3}>
                {/* Todo: Move to SingleStrokeView? */}
                <Button onClick={props.addStroke}>New stroke</Button>
                <Flex columnGap={2} justifyContent="stretch">
                  <Button flexGrow={1} onClick={props.prevHole}>
                    Last
                  </Button>
                  <Button flexGrow={1} onClick={props.nextHole}>
                    Next
                  </Button>
                </Flex>
              </Flex>
            </StrokesContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
