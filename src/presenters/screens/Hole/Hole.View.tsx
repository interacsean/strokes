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
import { StrokeView } from "./components/StrokeRow/StrokeRow.view";
import { Club } from "model/Club";
import { StrokeWithDerivedFields } from "model/Stroke";
import { LatLng } from "model/LatLng";
import { CaddySuggestion } from "usecases/stroke/calculateCaddySuggestions";
import { Container, StrokesContainer } from "./Hole.styles";
import { HoleOverview } from "./components/HoleOverview/HoleOverview.view";
import { StrokeHeaderView } from "./components/StrokeRow/StrokeRow.header.view";
import { StrokeType } from "model/StrokeType";

export type HoleViewProps = {
  holeNum: number;
  hole: HoleModel;
  currentPosition: LatLng | undefined;
  nextHole: () => void;
  prevHole: () => void;
  setPar: (n: number) => void;
  selectStrokeLie: (stroke: number, lie: Lie) => void;
  selectStrokeClub: (stroke: number, club: Club) => void;
  selectStrokeType: (stroke: number, strokeType: StrokeType) => void;
  strokeInputList: StrokeWithDerivedFields[];
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
  const { inputProps: parInputProps, setCurrentValue: setParInputValue } =
    useInput({
      initValue: `${props.hole.par}`,
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
      setParInputValue(`${props.hole.par}`);
    },
    [setParInputValue, props.holeNum, props.hole.par]
  );

  const setStrokePosition = useCallback(
    (strokeNum: number) =>
      currentPosition && parentSetStrokePos(strokeNum, currentPosition),
    [currentPosition, parentSetStrokePos]
  );

  const setLiePosition = useCallback(
    (strokeNum: number) =>
      currentPosition && parentSetLiePos(strokeNum, currentPosition),
    [currentPosition, parentSetLiePos]
  );

  const [tabIndex, setTabIndex] = useState(DEFAULT_HOLE_TAB);

  return {
    parInputProps,
    tabIndex,
    setTabIndex,
    switchViewMap: useCallback(() => setTabIndex(0), [setTabIndex]),
    switchViewStrokeList: useCallback(() => setTabIndex(1), [setTabIndex]),
    setStrokePosition,
    setLiePosition,
  };
}

export function HoleView(props: HoleViewProps) {
  const viewLogic = useHoleViewLogic(props);

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
                  props.setTeePos('default', props.currentPosition)
                }
              >
                📍⛳️
              </Button>
            </FormLabel>
            <FormLabel>
              <Text>Par {props.hole.par}</Text>
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
                  currentStrokeNum={props.strokeInputList.length}
                  distanceToHole={props.distanceToHole}
                  holeAltitudeDelta={props.holeAltitudeDelta}
                  holeLength={props.holeLength}
                  par={props.hole.par}
                  roundScore={props.roundScore}
                />
              </Box>
              <StrokeHeaderView />
              {props.strokeInputList.map((stroke, i) => {
                return (
                  <StrokeView
                    key={i}
                    strokeNum={i + 1}
                    stroke={stroke}
                    selectLie={props.selectStrokeLie}
                    selectClub={props.selectStrokeClub}
                    selectStrokeType={props.selectStrokeType}
                    setLiePosition={viewLogic.setLiePosition}
                    setStrokePosition={viewLogic.setStrokePosition}
                    current={i === props.strokeInputList.length - 1}
                  />
                );
              })}
              <Button onClick={props.addStroke}>New stroke</Button>

              <Flex columnGap={2} justifyContent="stretch">
                <Button flexGrow={1} onClick={props.prevHole}>
                  Last
                </Button>
                <Button flexGrow={1} onClick={props.nextHole}>
                  Next
                </Button>
              </Flex>
            </StrokesContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
