import React from "react";
import { Box, Text } from "@chakra-ui/react";

export type HoleViewProps = {
  holeNum: number;
  clubStats: any[];
};

export function HoleView(props: HoleViewProps) {
  return (
    <>
      <Text>Hole {props.holeNum}</Text>
      <Box></Box>
    </>
  );
}
