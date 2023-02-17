import React, { useCallback } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import {
  holeReducer,
  HoleState,
  initialHoleState,
} from "interfaceAdaptorsLayer/presenters/screens/Hole/reducer";

export type HoleViewProps = {
  holeNum: number;
  hole: { holeNum: number };
  nextHole: () => void;
  prevHole: () => void;
};

export function Hole(props: HoleViewProps) {
  // const [state, dispatch] = React.useReducer(holeReducer, initialHoleState);
  const onClickNextHole = useCallback(props.nextHole, [props.nextHole]);
  const onClickPrevHole = useCallback(props.prevHole, [props.prevHole]);

  return (
    <>
      <Text>Hole {props.holeNum}</Text>
      <Box>
        <Button onClick={onClickNextHole}>Next</Button>
        <Button onClick={onClickPrevHole}>Last</Button>
      </Box>
    </>
  );
}
