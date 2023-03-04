import React, { useCallback } from "react";
import { Box, Button, Flex, FormLabel, Input, Text } from "@chakra-ui/react";

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
    <Flex flexDir="column" rowGap={2}>
      <Text>Hole {props.holeNum}</Text>
      <Flex columnGap={2} justifyContent="stretch">
        <Button flexGrow={1} onClick={onClickPrevHole}>Last</Button>
        <Button flexGrow={1} onClick={onClickNextHole}>Next</Button>
      </Flex>
    </Flex>
  );
}
