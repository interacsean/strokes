import { useCallback, useState } from "react";
import { Box, Button, Flex, IconButton, Select, Text } from "@chakra-ui/react";
import Map, { MapFrame } from "presenters/components/Map/Map";
import { MAP_OVERLAY_PROPS } from "presenters/components/Map/useMeasureTool";
import { ChevronDownIcon, EditIcon } from "@chakra-ui/icons";
import { CollapseIcon } from "presenters/components/icons/MapIcons";
import { Hole } from "model/Hole";
import { LatLng } from "model/LatLng";
import { ClubRanges } from "usecases/stroke/calculateClubRanges";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";
import { selectCurrentPinFromHole } from "state/course/selectors/currentPin";
import { samePosition } from "usecases/hole/samePosition";
import { PARS } from "./HoleOverview/ParSelect.view";

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
  par: number | undefined;
  setPar: (par: number) => void;
  setTeePos: (pos: LatLng) => void;
  setHolePos: (pos: LatLng) => void;
  /** Opens the map ready for the player to tap where this marker goes, and
   * goes back to the stroke once they have. */
  initialPlacing?: HoleMarker | null;
  onClose: () => void;
};

export function FullScreenMap(props: FullScreenMapProps) {
  const [frame, setFrame] = useState<MapFrame>("stroke");
  const [placing, setPlacing] = useState<HoleMarker | null>(
    props.initialPlacing ?? null
  );
  // Opened from the stroke just to put a marker down, the map has done its job
  // once the marker is down (or the player thinks better of it).
  const [returnWhenPlaced] = useState(!!props.initialPlacing);
  const [showDetails, setShowDetails] = useState(true);

  // Framing the stroke only shows anything different once the ball has moved on
  // from the tee, so until then there is nothing to toggle between.
  const teePos = selectCurrentTeeFromHole(props.hole)?.pos;
  const pinPos = selectCurrentPinFromHole(props.hole);
  const canFrameStroke =
    !placing && !!props.fromPos && !samePosition(props.fromPos, teePos);

  const { setTeePos, setHolePos, onClose } = props;
  const stopPlacing = useCallback(() => {
    if (returnWhenPlaced) onClose();
    else setPlacing(null);
  }, [returnWhenPlaced, onClose]);
  const placeMarker = useCallback(
    (pos: LatLng) => {
      if (placing === "tee") setTeePos(pos);
      if (placing === "pin") setHolePos(pos);
      stopPlacing();
    },
    [placing, setTeePos, setHolePos, stopPlacing]
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
            // Clear of the tab that hides the details panel.
            readoutsBottom={showDetails ? 6 : 1}
            // Under the button that closes the map.
            measureButtonTop={10}
          />
        ) : (
          <Flex height="100%" alignItems="center" justifyContent="center">
            <Text color="white">Loading map</Text>
          </Flex>
        )}
        {canFrameStroke && (
          <Flex
            {...MAP_OVERLAY_PROPS}
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
          {...MAP_OVERLAY_PROPS}
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
        {!showDetails && (
          <IconButton
            {...MAP_OVERLAY_PROPS}
            aria-label="Show hole details"
            variant="unstyled"
            display="flex"
            minW="auto"
            height="auto"
            p={1.5}
            borderRadius="md"
            bgColor="rgba(0, 0, 0, 0.55)"
            color="white"
            position="absolute"
            // Over the GPS accuracy, when there is one to show.
            bottom={props.gpsAccuracy !== undefined ? 8 : 1}
            right={1}
            onClick={() => setShowDetails(true)}
          >
            <EditIcon boxSize={5} />
          </IconButton>
        )}
        {placing && (
          <Flex
            {...MAP_OVERLAY_PROPS}
            position="absolute"
            left={2}
            // Clear of the button that shows the details panel again.
            right={showDetails ? 2 : 12}
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
              onClick={stopPlacing}
            >
              Cancel
            </Button>
          </Flex>
        )}
      </Box>
      {showDetails && (
        <Flex
          position="relative"
          bgColor="white"
          px={4}
          py={3}
          columnGap={3}
          alignItems="flex-end"
          justifyContent="space-around"
        >
          <IconButton
            {...MAP_OVERLAY_PROPS}
            aria-label="Hide hole details"
            variant="unstyled"
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            // A tab on the top edge of the panel, sitting over the map.
            bottom="100%"
            right={4}
            minW="auto"
            width={12}
            height={5}
            bgColor="white"
            borderTopRadius="md"
            borderBottomRadius={0}
            onClick={() => setShowDetails(false)}
          >
            <ChevronDownIcon boxSize={5} />
          </IconButton>
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
            <Select
              aria-label="Par"
              size="md"
              width="4.5rem"
              value={props.par ?? ""}
              onChange={(e) => {
                const par = parseInt(e.target.value, 10);
                if (par) props.setPar(par);
              }}
            >
              <option value="" disabled hidden>
                –
              </option>
              {PARS.map((par) => (
                <option key={par} value={par}>
                  {par}
                </option>
              ))}
            </Select>
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
      )}
    </Flex>
  );
}
