import { Flex, Text } from "@chakra-ui/react";
import { GpsAccuracyIcon } from "presenters/components/icons/MapIcons";

// beyond this, the reading is too vague to be worth a precise number
const MAX_REPORTED_ACCURACY = 50;

type GpsAccuracyProps = {
  // accuracy radius in metres, as reported by the geolocation API
  accuracy: number | null | undefined;
};

// todo: design – colour/iconography should signal good vs poor accuracy
export function GpsAccuracy({ accuracy }: GpsAccuracyProps) {
  if (accuracy === null || accuracy === undefined || isNaN(accuracy)) {
    return null;
  }

  return (
    <Flex
      alignItems="center"
      columnGap={1}
      bgColor="rgba(0, 0, 0, 0.55)"
      borderRadius="md"
      px={1.5}
      py={1}
    >
      <GpsAccuracyIcon boxSize={3} color="white" />
      <Text
        color="white"
        fontSize={`${11 / 16}rem`}
        fontWeight={800}
        lineHeight="1em"
      >
        {accuracy > MAX_REPORTED_ACCURACY
          ? `${MAX_REPORTED_ACCURACY}+`
          : Math.round(accuracy)}
      </Text>
    </Flex>
  );
}
