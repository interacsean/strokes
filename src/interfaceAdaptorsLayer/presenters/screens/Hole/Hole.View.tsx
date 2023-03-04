import React, { useCallback } from "react";
import { Box, Button, Flex, FormLabel, Input, Text } from "@chakra-ui/react";
import { Hole as HoleModel } from "model/Hole";
import { Club } from "model/Club";
import { Lie } from "model/Lie";
import { LatLng } from "model/LatLng";
import { StrokeType } from "model/StrokeType";

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

export function Hole(props: HoleViewProps) {


  // const [state, dispatch] = React.useReducer(holeReducer, initialHoleState);
  const onClickNextHole = useCallback(props.nextHole, [props.nextHole]);
  const onClickPrevHole = useCallback(props.prevHole, [props.prevHole]);

  return (
    <Flex flexDir="column" rowGap={2}>
      <Text>Hole {props.holeNum}</Text>
      <FormLabel>
        <Input name="par" onChange={(e) => {
          props.setPar(parseInt(e.currentTarget.value, 10))
        }} />
        <Text>Par</Text>
      </FormLabel>
      <Flex columnGap={2} justifyContent="stretch">
        <Button flexGrow={1} onClick={onClickPrevHole}>Last</Button>
        <Button flexGrow={1} onClick={onClickNextHole}>Next</Button>
      </Flex>
    </Flex>
  );
}
