import { useState } from "react";
import { Box, Button, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import Map, { MapFrame } from "presenters/components/Map/Map";
import { CollapseIcon } from "presenters/components/icons/MapIcons";
import { Hole } from "model/Hole";
import { LatLng } from "model/LatLng";
import { useInput } from "presenters/utils/useInput/useInput";
import { ClubRanges } from "usecases/stroke/calculateClubRanges";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";
import { samePosition } from "usecases/hole/samePosition";

const FRAME_OPTIONS: [MapFrame, string][] = [
  ["hole", "Hole"],
  ["stroke", "Shot"],
];

type FullScreenMapProps = {
  hole: Hole;
  currentPosition: LatLng | undefined;
  /** Start of the stroke being played; green distances are measured from here. */
  fromPos: LatLng | undefined;
  /** Where the stroke came to rest, once it has been taken. */
  toPos: LatLng | undefined;
  clubRanges: ClubRanges | null;
  gpsAccuracy: number | undefined;
  parInputProps: ReturnType<typeof useInput>["inputProps"];
  setTeePos: (teeName: string, pos: LatLng) => void;
  setHolePos: (pos: LatLng) => void;
  onClose: () => void;
};

export function FullScreenMap(props: FullScreenMapProps) {
  const [frame, setFrame] = useState<MapFrame>("stroke");

  // Framing the stroke only shows anything different once the ball has moved on
  // from the tee, so until then there is nothing to toggle between.
  const teePos = selectCurrentTeeFromHole(props.hole)?.pos;
  const canFrameStroke =
    !!props.fromPos && !samePosition(props.fromPos, teePos);

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
            ballPos={props.toPos ?? null}
            strokeFromPos={props.fromPos}
            zoomFactor={2}
            hole={props.hole}
            currentPosition={props.currentPosition}
            gpsAccuracy={props.gpsAccuracy}
            showGreenDistanceLabels
            measureDistancesFrom={props.fromPos}
            clubRanges={props.clubRanges}
            frame={frame}
          />
        ) : (
          <Flex height="100%" alignItems="center" justifyContent="center">
            <Text color="white">Loading map</Text>
          </Flex>
        )}
        {canFrameStroke && (
          <Flex
            position="absolute"
            top={1}
            left={1}
            borderRadius="md"
            overflow="hidden"
            bgColor="rgba(0, 0, 0, 0.55)"
          >
            {FRAME_OPTIONS.map(([option, label]) => (
              <Button
                key={option}
                aria-label={`Frame ${label.toLowerCase()}`}
                aria-pressed={frame === option}
                variant="unstyled"
                minW="auto"
                height="auto"
                px={2.5}
                py={1.5}
                borderRadius={0}
                fontSize="xs"
                color={frame === option ? "black" : "white"}
                bgColor={frame === option ? "white" : "transparent"}
                onClick={() => setFrame(option)}
              >
                {label}
              </Button>
            ))}
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
