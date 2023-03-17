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
  Stack,
  VStack,
} from "@chakra-ui/react";
import { Hole as HoleModel } from "model/Hole";
import { Lie } from "model/Lie";
import { useInput } from "interfaceAdaptorsLayer/presenters/utils/useInput/useInput";
import { StrokeView } from "./components/StrokeRow.view";
import { newStroke } from "interfaceAdaptorsLayer/usecaseLayer/usecases/stroke/newStroke";
import { Club } from "model/Club";
import { Stroke } from "model/Stroke";

export type HoleViewProps = {
  holeNum: number;
  hole: HoleModel;
  // currentPosition: LatLng;
  nextHole: () => void;
  prevHole: () => void;
  setPar: (n: number) => void;
  selectStrokeLie: (stroke: number, lie: Lie) => void;
  selectStrokeClub: (stroke: number, club: Club) => void;
  strokeInputList: Stroke[];
  // setStrokeEndPos: (stroke: number, pos: LatLng) => void;
  // setStrokeStartPos: (stroke: number, pos: LatLng) => void;
  // holedStroke: () => void;
  // selectStrokeType: (stroke: number, strokeType: StrokeType) => void;
  // setHoleTeePos: (teeColor: string, pos1: LatLng, pos2: LatLng) => void;
  // setHolePinPos: (pos: LatLng) => void;
};

const DEFAULT_HOLE_TAB = 1;

function useHoleViewLogic(props: HoleViewProps) {
  const { inputProps: parInputProps, setCurrentValue: setParInputValue } = useInput({
    initValue: `${props.hole.par}`,
    onBlur: (value) => {
      const newPar = parseInt(value, 10);
      if (!isNaN(newPar)) {
        props.setPar(newPar);
      }
    }
  });
  useEffect(
    function updateParInputValueOnHoleUpdate(){
      setParInputValue(`${props.hole.par}`)
    },
    [setParInputValue, props.holeNum],
  );

  const [tabIndex, setTabIndex] = useState(DEFAULT_HOLE_TAB);

  return {
    parInputProps,
    tabIndex, 
    setTabIndex,
    switchViewMap: () => setTabIndex(0),
    switchViewStrokeList: () => setTabIndex(1),
  };
}

export function HoleView(props: HoleViewProps) {
  const viewLogic = useHoleViewLogic(props);

  // const [state, dispatch] = React.useReducer(holeReducer, initialHoleState);

  return (
    <Flex flexDir="column" rowGap={2}>
      <Text>Hole {props.holeNum}</Text>
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
          </TabPanel>
          <TabPanel>
            <VStack spacing={2}>
              {props.strokeInputList.map((stroke, i) => {
                return (
                  <StrokeView
                    key={i}
                    strokeNum={i + 1}
                    stroke={stroke}
                    selectLie={props.selectStrokeLie}
                    selectClub={props.selectStrokeClub}
                  />
                )
              })}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Flex columnGap={2} justifyContent="stretch">
        <Button flexGrow={1} onClick={props.prevHole}>Last</Button>
        <Button flexGrow={1} onClick={props.nextHole}>Next</Button>
      </Flex>
    </Flex>
  );
}
