import React, { useCallback, useEffect, useState } from "react";
import { 
  Box,
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
  useTab,
} from "@chakra-ui/react";
import { Hole as HoleModel } from "model/Hole";
import { Lie } from "model/Lie";
import { useInput } from "interfaceAdaptorsLayer/presenters/utils/useInput/useInput";

export type HoleViewProps = {
  holeNum: number;
  hole: HoleModel;
  // currentPosition: LatLng;
  nextHole: () => void;
  prevHole: () => void;
  setPar: (n: number) => void;
  selectStrokeLie: (stroke: number, lie: Lie) => void;
  // selectStrokeClub: (stroke: number, club: Club) => void;
  // setStrokeEndPos: (stroke: number, pos: LatLng) => void;
  // setStrokeStartPos: (stroke: number, pos: LatLng) => void;
  // holedStroke: () => void;
  // selectStrokeType: (stroke: number, strokeType: StrokeType) => void;
  // setHoleTeePos: (teeColor: string, pos1: LatLng, pos2: LatLng) => void;
  // setHolePinPos: (pos: LatLng) => void;
};

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

  const [tabIndex, setTabIndex] = useState(0);

  return {
    parInputProps,
    tabIndex, 
    setTabIndex,
    switchViewMap: () => setTabIndex(0),
    switchViewStrokeList: () => setTabIndex(1),
  };
}

export function Hole(props: HoleViewProps) {
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
            <p>Strokes</p>
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
