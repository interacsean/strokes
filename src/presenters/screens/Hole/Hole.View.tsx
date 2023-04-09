import { useEffect, useState } from "react";
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
  VStack,
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

export type HoleViewProps = {
  holeNum: number;
  hole: HoleModel;
  currentPosition: LatLng | undefined;
  nextHole: () => void;
  prevHole: () => void;
  setPar: (n: number) => void;
  selectStrokeLie: (stroke: number, lie: Lie) => void;
  selectStrokeClub: (stroke: number, club: Club) => void;
  strokeInputList: StrokeWithDerivedFields[];
  setLiePos: (stroke: number, pos: LatLng) => void;
  setStrokePos: (stroke: number, pos: LatLng) => void;
  caddySuggestions: CaddySuggestion[];
  setHolePos: (pos: LatLng) => void;
  addStroke: () => void;
  // setStrokeEndPos: (stroke: number, pos: LatLng) => void;
  // setStrokeStartPos: (stroke: number, pos: LatLng) => void;
  // holedStroke: () => void;
  // selectStrokeType: (stroke: number, strokeType: StrokeType) => void;
  // setHoleTeePos: (teeColor: string, pos1: LatLng, pos2: LatLng) => void;
  // setHolePinPos: (pos: LatLng) => void;
};

const DEFAULT_HOLE_TAB = 1;

function useHoleViewLogic(props: HoleViewProps) {
  const { inputProps: parInputProps, setCurrentValue: setParInputValue } =
    useInput({
      initValue: `${props.hole.par}`,
      onBlur: (value) => {
        const newPar = parseInt(value, 10);
        if (!isNaN(newPar)) {
          props.setPar(newPar);
        }
      },
    });
  useEffect(
    function updateParInputValueOnHoleUpdate() {
      setParInputValue(`${props.hole.par}`);
    },
    [setParInputValue, props.holeNum, props.hole.par]
  );

  const setStrokePosition = (strokeNum: number) =>
    props.currentPosition &&
    props.setStrokePos(strokeNum, props.currentPosition);

  const setLiePosition = (strokeNum: number) =>
    props.currentPosition &&
    props.setLiePos(strokeNum, props.currentPosition);

  const [tabIndex, setTabIndex] = useState(DEFAULT_HOLE_TAB);

  return {
    parInputProps,
    tabIndex,
    setTabIndex,
    switchViewMap: () => setTabIndex(0),
    switchViewStrokeList: () => setTabIndex(1),
    setStrokePosition,
    setLiePosition,
  };
}

export function HoleView(props: HoleViewProps) {
  const viewLogic = useHoleViewLogic(props);

  // const [state, dispatch] = React.useReducer(holeReducer, initialHoleState);

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
              <Box mx={-4} mt={-4} >
                <HoleOverview
                  holeNum={props.holeNum}
                  currentStrokeNum={props.strokeInputList.length}
                  distanceToHole={undefined}
                  holeAltitudeDelta={undefined}
                  holeDistance={350}
                  par={props.hole.par}
                  playerRoundScore={8}
                />

              </Box>
              {props.strokeInputList.map((stroke, i) => {
                return (
                  <StrokeView
                    key={i}
                    strokeNum={i + 1}
                    stroke={stroke}
                    selectLie={props.selectStrokeLie}
                    selectClub={props.selectStrokeClub}
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