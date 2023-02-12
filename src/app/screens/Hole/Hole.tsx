import React from "react";
import { Box, Text } from "@chakra-ui/react";
import {
  holeReducer,
  HoleState,
  initialHoleState,
} from "app/screens/Hole/reducer";

type Props = {};

export function Hole(props: Props) {
  const [state, dispatch] = React.useReducer(holeReducer, initialHoleState);

  return (
    <>
      <Text>Hole {state.holeNum}</Text>
      <Box></Box>
    </>
  );
}
