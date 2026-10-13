import { useCallback, useState } from "react";
import { Box, Button, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import Map, { MapFrame } from "presenters/components/Map/Map";
import { CollapseIcon } from "presenters/components/icons/MapIcons";
import { Hole } from "model/Hole";
import { LatLng } from "model/LatLng";
import { useInput } from "presenters/utils/useInput/useInput";
import { ClubRanges } from "usecases/stroke/calculateClubRanges";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";
import { selectCurrentPinFromHole } from "state/course/selectors/currentPin";
import { samePosition } from "usecases/hole/samePosition";

/** The compass in the top left corner, plus the gap either side of it. */
const WIND_COMPASS_LEFT_OFFSET = "72px";

const FRAME_OPTIONS: [MapFrame, string][] = [
  ["hole", "Hole"],
  ["stroke", "Shot"],
];

/** The ends of the hole the player can put on the map themselves. */
export type HoleMarker = "tee" | "pin";

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
  setTeePos: (pos: LatLng) => void;
  setHolePos: (pos: LatLng) => void;
  /** Opens the map ready for the player to tap where this marker goes. */
  initialPlacing?: HoleMarker | null;
  onClose: () => void;
};

export function FullScreenMap(props: FullScreenMapProps) {
  const [frame, setFrame] = useState<MapFrame>("stroke");
  const [placing, setPlacing] = useState<HoleMarker | null>(
    props.initialPlacing ?? null
  );

  // Framing the stroke only shows anything different once the ball has moved on
  // from the tee, so until then there is nothing to toggle between.
  const teePos = selectCurrentTeeFromHole(props.hole)?.pos;
  const pinPos = selectCurrentPinFromHole(props.hole);
  const canFrameStroke =
    !placing && !!props.fromPos && !samePosition(props.fromPos, teePos);

  const { setTeePos, setHolePos } = props;
  const placeMarker = useCallback(
    (pos: LatLng) => {
      if (placing === "tee") setTeePos(pos);
      if (placing === "pin") setHolePos(pos);
      setPlacing(null);
    },
    [placing, setTeePos, setHolePos]
  );
  const togglePlacing = (marker: HoleMarker) =>
    setPlacing((current) => (current === marker ? null : marker));

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
            // Until the stroke is taken the ball is still sitting where it is
            // played from, which is where it belongs on the map.
            ballPos={props.toPos ?? props.fromPos ?? null}
            strokeFromPos={props.fromPos}
            zoomFactor={2}
            hole={props.hole}
            currentPosition={props.currentPosition}
            gpsAccuracy={props.gpsAccuracy}
            showGreenDistanceLabels
            measureDistancesFrom={props.fromPos}
            clubRanges={props.clubRanges}
            frame={frame}
            onMapClick={placing ? placeMarker : undefined}
            holdCamera={!!placing}
            greedyGestures
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
            // Clear of the wind compass, which sits in the corner.
            left={WIND_COMPASS_LEFT_OFFSET}
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
        {placing && (
          <Flex
            position="absolute"
            left={2}
            right={2}
            bottom={8}
            px={3}
            py={2.5}
            columnGap={2}
            alignItems="center"
            borderRadius="md"
            bgColor="rgba(0, 0, 0, 0.7)"
          >
            <Text color="white" flex={1} fontSize="sm">
              Tap the map where the {placing} is
            </Text>
            <Button
              size="sm"
              variant="primary"
              isDisabled={!props.currentPosition}
              onClick={() =>
                props.currentPosition && placeMarker(props.currentPosition)
              }
            >
              I'm here
            </Button>
            <Button
              size="sm"
              variant="ghost"
              color="white"
              onClick={() => setPlacing(null)}
            >
              Cancel
            </Button>
          </Flex>
        )}
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
          <Text variant="solidLabel">Tee</Text>
          <Button
            variant={placing === "tee" ? "primary" : "primaryOutline"}
            aria-pressed={placing === "tee"}
            onClick={() => togglePlacing("tee")}
          >
            {teePos ? "Move tee" : "Set tee"}
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
          <Text variant="solidLabel">Pin</Text>
          <Button
            variant={placing === "pin" ? "primary" : "primaryOutline"}
            aria-pressed={placing === "pin"}
            onClick={() => togglePlacing("pin")}
          >
            {pinPos ? "Move pin" : "Set pin"}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
