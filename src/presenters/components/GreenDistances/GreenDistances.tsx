import { Flex, Text } from "@chakra-ui/react";
import {
  GreenDistance,
  GreenPointKey,
} from "usecases/hole/calculateGreenDistances";

const POINT_SUFFIX: Record<GreenPointKey, string> = {
  front: "F",
  pin: "P",
  back: "B",
};

type GreenDistancesProps = {
  // front, pin and back of the green, in the order they should read
  distances: GreenDistance[];
};

export function GreenDistances({ distances }: GreenDistancesProps) {
  if (distances.length === 0) {
    return null;
  }

  return (
    <Flex
      alignItems="center"
      bgColor="rgba(0, 0, 0, 0.55)"
      borderRadius="md"
      px={1.5}
      py={1}
    >
      <Text
        color="white"
        fontSize={`${11 / 16}rem`}
        fontWeight={800}
        lineHeight="1em"
        whiteSpace="nowrap"
      >
        {distances
          .map(
            ({ key, distance }) => `${Math.round(distance)}${POINT_SUFFIX[key]}`
          )
          .join(" / ")}
      </Text>
    </Flex>
  );
}
