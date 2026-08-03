import { Box, Button, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import Map from "presenters/components/Map/Map";
import { CollapseIcon } from "presenters/components/icons/MapIcons";
import { Hole } from "model/Hole";
import { LatLng } from "model/LatLng";
import { useInput } from "presenters/utils/useInput/useInput";

type FullScreenMapProps = {
  hole: Hole;
  currentPosition: LatLng | undefined;
  gpsAccuracy: number | undefined;
  parInputProps: ReturnType<typeof useInput>["inputProps"];
  setTeePos: (teeName: string, pos: LatLng) => void;
  setHolePos: (pos: LatLng) => void;
  onClose: () => void;
};

export function FullScreenMap(props: FullScreenMapProps) {
  return (
    <Flex
      position="fixed"
      top={0}
      right={0}
      bottom={0}
      left={0}
      zIndex={40}
      flexDir="column"
      alignItems="stretch"
      bgColor="black"
    >
      <Box flex={1} position="relative">
        {props.currentPosition ? (
          <Map
            mapId="fullScreenMap"
            tilt={52}
            ballPos={null}
            zoomFactor={2}
            hole={props.hole}
            currentPosition={props.currentPosition}
            gpsAccuracy={props.gpsAccuracy}
          />
        ) : (
          <Flex height="100%" alignItems="center" justifyContent="center">
            <Text color="white">Loading map</Text>
          </Flex>
        )}
        <IconButton
          aria-label="Close map"
          variant="unstyled"
          display="flex"
          minW="auto"
          height="auto"
          p={1.5}
          borderRadius="md"
          bgColor="rgba(0, 0, 0, 0.55)"
          color="white"
          position="absolute"
          top={1}
          right={1}
          onClick={props.onClose}
        >
          <CollapseIcon boxSize={5} />
        </IconButton>
      </Box>
      <Flex
        bgColor="white"
        px={4}
        py={3}
        columnGap={3}
        alignItems="flex-end"
        justifyContent="space-around"
      >
        <Flex flexDir="column" alignItems="center" rowGap={1}>
          <Text variant="solidLabel">Tee pos</Text>
          <Button
            variant="primaryOutline"
            onClick={() =>
              props.currentPosition &&
              props.setTeePos("default", props.currentPosition)
            }
          >
            📍⛳️
          </Button>
        </Flex>
        <Flex flexDir="column" alignItems="center" rowGap={1}>
          <Text variant="solidLabel">Par</Text>
          <Input
            name="par"
            width="4rem"
            textAlign="center"
            {...props.parInputProps}
          />
        </Flex>
        <Flex flexDir="column" alignItems="center" rowGap={1}>
          <Text variant="solidLabel">Hole pos</Text>
          <Button
            variant="primaryOutline"
            onClick={() =>
              props.currentPosition && props.setHolePos(props.currentPosition)
            }
          >
            📍⛳️
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
