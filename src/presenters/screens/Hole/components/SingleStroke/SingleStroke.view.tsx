import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { CustomModalSelect } from "presenters/components/CustomModalSelect/CustomModalSelect";
import { StrokeWithDerivedFields } from "model/Stroke";
import { HoleViewProps } from "../../Hole.view";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ClubSelectModal } from "./ClubSelectModal.view";
import { Club, shortClubNames } from "model/Club";
import { ShotSelectModal } from "./ShotSelectModal.view";
import { LieSelectModal } from "./LieSelectModal.view";
import { DropdownButton } from "presenters/components/DropdownButton/DropdownButton";
import { Hole } from "model/Hole";
import { PosOption, PosOptionMethods } from "model/PosOptions";
import { LatLng } from "model/LatLng";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";
import { Lie, shortLieNames } from "model/Lie";
import Map from "presenters/components/Map/Map";
import { ClubStats } from "model/ClubStats";
import { CaddySuggestion } from "usecases/stroke/calculateCaddySuggestions";
import { StrokeType } from "model/StrokeType";

export type SingleStrokeViewProps = {
  hole: Hole;
  strokeNum: number;
  stroke: StrokeWithDerivedFields;
  strokes: StrokeWithDerivedFields[];
  selectFromLie: HoleViewProps["selectStrokeFromLie"];
  setFromPosMethod: HoleViewProps["setFromPosMethod"];
  selectToLie: HoleViewProps["selectStrokeToLie"];
  setToPosMethod: HoleViewProps["setToPosMethod"];
  selectClub: HoleViewProps["selectStrokeClub"];
  selectStrokeType: HoleViewProps["selectStrokeType"];
  setToPosition: (strokeNum: number, optPos?: LatLng) => void;
  setFromPosition: (strokeNum: number, optPos?: LatLng) => void;
  fromPosOptions: PosOption[];
  fromLies: Lie[];
  toPosOptions: PosOption[];
  toLies: Lie[];
  clubs: Club[];
  distanceUnit: string;
  currentPosition: LatLng | undefined;
  prevStroke: StrokeWithDerivedFields | undefined;
  nextStroke: StrokeWithDerivedFields | undefined;
  clubStats: ClubStats;
  caddySuggestions: CaddySuggestion[];
  distToTarget: number | null;
};

enum Modals {
  Club = "Club",
  Shot = "Shot",
  FromLie = "FromLie",
  ToLie = "ToLie",
}

function useSingleStrokeViewLogic(props: SingleStrokeViewProps) {
  const [activeModal, setActiveModal] = useState<Modals | null>(null);

  const {
    setFromPosition,
    setToPosition,
    fromPosOptions,
    toPosOptions,
    stroke: { fromPosSetMethod, fromPos, toPosSetMethod, toPos },
    hole: { pinPlayed, pins, holeNum, tees, teePlayed },
    currentPosition,
    setFromPosMethod,
    setToPosMethod,
    strokeNum,
    caddySuggestions,
    selectClub,
    selectStrokeType,
    prevStroke,
    nextStroke,
  } = props;

  const teePlayedUsed = useMemo(
    () => (teePlayed ? tees[teePlayed] : Object.values(tees)[0]),
    [tees, teePlayed]
  );

  const [localStrokeNum, setLocalStrokeNum] = useState(strokeNum);
  useEffect(
    function updateLocalStrokeNumOnStrokeNumChange() {
      setLocalStrokeNum(strokeNum);
    },
    [strokeNum]
  );
  const [localHoleNum, setLocalHoleNum] = useState(holeNum);
  useEffect(
    function updateLocalHoleNumOnHoleNumChange() {
      setLocalHoleNum(holeNum);
    },
    [holeNum]
  );

  const [mapClickAction, setMapClickAction] = useState<null | "from" | "to">(
    null
  );

  useEffect(
    function takeActionOnFromMethodChange() {
      if (holeNum === localHoleNum && strokeNum === localStrokeNum) {
        // fromPosSetMethod and not because of changing shots or holes
        switch (fromPosSetMethod) {
          case PosOptionMethods.TEE:
            // todo: determine the correct fromTee
            if (teePlayedUsed?.pos) {
              setFromPosition(strokeNum, teePlayedUsed?.pos);
            }
            break;
          case PosOptionMethods.CUSTOM:
            setMapClickAction("from");
            break;
          case PosOptionMethods.DROP:
            // todo: show drop stuff?
            break;
          case PosOptionMethods.LAST_SHOT:
            setFromPosition(strokeNum);
            break;
        }
      }
    },
    [fromPosSetMethod]
  );

  const pinPlayedUsed = useMemo(
    () => (pinPlayed ? pins[pinPlayed] : Object.values(pins)[0]),
    [pins, pinPlayed]
  );

  useEffect(
    function takeActionOnToMethodChange() {
      if (holeNum === localHoleNum && strokeNum === localStrokeNum) {
        // toPosSetMethod and not because of changing shots or holes
        switch (toPosSetMethod) {
          case PosOptionMethods.CUSTOM:
            setMapClickAction("to");
            break;
          case PosOptionMethods.HOLE:
            setToPosition(strokeNum, pinPlayedUsed);
            break;
          case PosOptionMethods.NEAR_PIN:
            setToPosition(strokeNum, pinPlayedUsed);
            // todo:
            // 2) queing up change as this call overwrites the previous update since it is paired with the current course
            // if (!toLie) selectToLie(strokeNum, Lie.GREEN);
            break;
        }
      }
    },
    [toPosSetMethod, pinPlayedUsed]
  );

  const clubOptions = useMemo(
    () =>
      props.clubs.map((club) => ({
        club,
      })),
    [props.clubs]
  );

  const fromPosButtonText = useMemo(() => {
    if (fromPosSetMethod === PosOptionMethods.TEE) {
      return [
        // todo: Show which Tee based on GPS match
        `Tee (TBD)`,
      ];
    }

    const matchingFPO = fromPosOptions.find(
      (fromPosOp) => fromPosOp.value === fromPosSetMethod
    );
    return [matchingFPO?.buttonText, matchingFPO?.buttonTextSmall];
  }, [fromPosOptions, fromPosSetMethod]);

  const distSinceFrom = useMemo(() => {
    if (!fromPos || !currentPosition) {
      return null;
    }
    return Math.round(
      calculateDistanceBetweenPositions(fromPos, currentPosition)
    );
  }, [fromPos, currentPosition]);

  const fromPosButtonColor = useMemo(() => {
    switch (fromPosSetMethod) {
      case PosOptionMethods.TEE:
        return "buttonReadOnly";
      case PosOptionMethods.DROP:
      case PosOptionMethods.GPS:
        return !fromPos ? "buttonUnsatisfied" : "buttonPrimary";
      case PosOptionMethods.CUSTOM:
        return "buttonUnsatisfied";
      case PosOptionMethods.LAST_SHOT:
        return prevStroke?.toPos ? "buttonPrimary" : "buttonUnsatisfied";
    }
  }, [fromPosSetMethod, fromPos]);

  const toPosButtonText = useMemo(() => {
    if (props.stroke.toPosSetMethod === PosOptionMethods.GPS) {
      const roundedShotDist = Math.round(props.stroke.strokeDistance || 0);

      return [
        roundedShotDist ? `${roundedShotDist}${props.distanceUnit}` : "Set GPS",
        ...(distSinceFrom
          ? [
              roundedShotDist === distSinceFrom
                ? undefined
                : `update:${distSinceFrom}${props.distanceUnit}`,
            ]
          : []),
      ];
    }
    const matchingTPO = toPosOptions.find(
      (toPosOp) => toPosOp.value === props.stroke.toPosSetMethod
    );
    return [matchingTPO?.buttonText, matchingTPO?.buttonTextSmall];
  }, [
    props.stroke.strokeDistance,
    props.distanceUnit,
    distSinceFrom,
    toPosOptions,
    props.stroke.toPosSetMethod,
  ]);

  const toPosButtonColor = useMemo(() => {
    switch (toPosSetMethod) {
      case PosOptionMethods.CUSTOM:
        return "buttonUnsatisfied";
      case PosOptionMethods.GPS:
        return !toPos ? "buttonUnsatisfied" : "buttonPrimary";
      case PosOptionMethods.HOLE:
      case PosOptionMethods.NEAR_PIN:
        return "buttonReadOnly";
    }
  }, [toPosSetMethod, toPos]);

  const viewSetFromPosMethod = useCallback(
    (value: string) => {
      const [posMethod] = value.split("/");
      //todo: do something with the tee type (after "/")
      setFromPosMethod(strokeNum, posMethod as PosOptionMethods);
    },
    [strokeNum, setFromPosMethod]
  );

  const viewSetToPosMethod = useCallback(
    (value: string) => {
      setToPosMethod(strokeNum, value as PosOptionMethods);
    },
    [strokeNum, setToPosMethod]
  );

  const setFromPosOnClick = useCallback(() => {
    switch (fromPosSetMethod) {
      case PosOptionMethods.LAST_SHOT:
        setFromPosition(strokeNum);
        if (strokeNum >= 2) {
          // Bug: at the time of calling, `setToPosition` updates the state based on the unupdated from position
          // setToPosition(strokeNum - 1);
        }
        break;
      case PosOptionMethods.GPS:
      case PosOptionMethods.DROP:
        setFromPosition(strokeNum);
        break;
      case PosOptionMethods.CUSTOM:
        setMapClickAction("from");
        break;
      case PosOptionMethods.TEE:
      // skip
    }
  }, [strokeNum, fromPosSetMethod, setFromPosition]);

  // Work-around for not being able to update two attributes at once
  const [pendingPosMethod, setPendingPosMethod] = useState<
    ["from" | "to", PosOptionMethods] | null
  >(null);
  useEffect(
    function updatePosMethodFromQueue() {
      if (pendingPosMethod?.[0] === "from") {
        setFromPosMethod(strokeNum, pendingPosMethod[1]);
        setPendingPosMethod(null);
      } else if (pendingPosMethod?.[0] === "to") {
        setToPosMethod(strokeNum, pendingPosMethod[1]);
        setPendingPosMethod(null);
      }
    },
    [pendingPosMethod?.[0], pendingPosMethod?.[1]]
  );

  const [pendingStrokeType, setPendingStrokeType] = useState<StrokeType | null>(
    null
  );
  useEffect(
    function updateStrokeTypeFromQueue() {
      if (pendingStrokeType) {
        selectStrokeType(strokeNum, pendingStrokeType);
        setPendingStrokeType(null);
      }
    },
    [pendingStrokeType, strokeNum]
  );

  const [pendingPos, setPendingPos] = useState<
    ["from" | "to", LatLng, number | undefined] | null
  >(null);
  useEffect(
    function updatePosFromQueue() {
      if (pendingPos?.[0] === "from") {
        setFromPosition(pendingPos?.[2] || strokeNum, pendingPos[1]);
        setPendingPos(null);
      } else if (pendingPos?.[0] === "to") {
        setToPosition(pendingPos?.[2] || strokeNum, pendingPos[1]);
        setPendingPos(null);
      }
    },
    [pendingPos?.[0], pendingPos?.[1], pendingPos?.[2]]
  );

  const setToPosOnClick = useCallback(() => {
    switch (toPosSetMethod) {
      case PosOptionMethods.GPS:
        setToPosition(strokeNum);
        break;
      case PosOptionMethods.CUSTOM:
        setMapClickAction("to");
        break;
    }
    if (nextStroke && nextStroke.fromPosSetMethod === PosOptionMethods.LAST_SHOT && currentPosition) {
      setPendingPos(["from", currentPosition, strokeNum + 1])
    }
  }, [toPosSetMethod, setToPosition, strokeNum, nextStroke, currentPosition, setPendingPos]);

  const onMapClick = useCallback(
    (pos: LatLng) => {
      if (mapClickAction === "from") {
        setFromPosition(strokeNum, pos);
        setPendingPosMethod(["from", PosOptionMethods.GPS]);
      } else if (mapClickAction === "to") {
        setToPosition(strokeNum, pos);
        setPendingPosMethod(["to", PosOptionMethods.GPS]);
      }
      setMapClickAction(null);
    },
    [mapClickAction, strokeNum, setToPosition, setFromPosition]
  );

  const closeModal = () => setActiveModal(null);

  const [usingCaddie, setShowCaddie] = useState(true);
  const showCaddie = () => setShowCaddie(true);
  const hideCaddie = () => setShowCaddie(false);

  const adoptCaddySuggestion = useCallback(() => {
    if (caddySuggestions?.[0]?.club) {
      selectClub(strokeNum, caddySuggestions[0].club);
      if (caddySuggestions?.[0]?.strokeType) {
        setPendingStrokeType(caddySuggestions?.[0]?.strokeType);
      }
    }
  }, [strokeNum, selectClub, caddySuggestions, setPendingStrokeType]);

  return {
    fromPosButtonText,
    setFromPosMethod: viewSetFromPosMethod,
    fromPosButtonColor,
    setFromPosOnClick,
    toPosButtonText,
    toPosButtonColor,
    setToPosMethod: viewSetToPosMethod,
    setToPosOnClick,
    activeModal,
    setActiveModal,
    clubOptions,
    closeModal,
    showCaddie,
    hideCaddie,
    usingCaddie,
    pinPlayedUsed,
    adoptCaddySuggestion,
    onMapClick: mapClickAction ? onMapClick : undefined,
  };
}

const inputLabelWidth = "4.5em";

export function SingleStrokeView(props: SingleStrokeViewProps) {
  const viewLogic = useSingleStrokeViewLogic(props);

  const modal =
    viewLogic.activeModal === Modals.Club ? (
      <ClubSelectModal
        clubs={viewLogic.clubOptions}
        selectClub={(club) => {
          props.selectClub(props.strokeNum, club);
          viewLogic.setActiveModal(null);
        }}
        cancel={viewLogic.closeModal}
        distanceUnit={props.distanceUnit}
        clubStats={props.clubStats}
        distToTarget={props.distToTarget}
      />
    ) : viewLogic.activeModal === Modals.FromLie ? (
      // todo: pass in valid from lies based on shot (i.e. tees)
      // todo: if from selection = last shot / disable this
      <LieSelectModal
        selectLie={(lie) => {
          props.selectFromLie(props.strokeNum, lie);
          viewLogic.setActiveModal(null);
        }}
        cancel={viewLogic.closeModal}
        lies={props.fromLies}
      />
    ) : viewLogic.activeModal === Modals.Shot ? (
      <ShotSelectModal
        selectStroke={(stroke) => {
          props.selectStrokeType(props.strokeNum, stroke);
          viewLogic.setActiveModal(null);
        }}
        cancel={viewLogic.closeModal}
      />
    ) : viewLogic.activeModal === Modals.ToLie ? (
      <LieSelectModal
        selectLie={(lie) => {
          props.selectToLie(props.strokeNum, lie);
          viewLogic.setActiveModal(null);
        }}
        cancel={viewLogic.closeModal}
        lies={props.toLies}
      />
    ) : null;

  return (
    <Box position="relative" height="100%">
      {modal && (
        <Box
          position="absolute"
          overflowY="auto"
          zIndex={10}
          top={0}
          right={0}
          left={0}
          bottom={0}
        >
          {modal}
        </Box>
      )}
      <Flex
        flexDir="column"
        rowGap={5}
        visibility={viewLogic.activeModal ? "hidden" : "visible"}
      >
        <Box
          bgColor="primary.200"
          color="white"
          height="120px"
          mx={-4}
          className="smallLogo"
        >
          {props.currentPosition && (
            <Map
              mapId="miniMap"
              holeOrientation="horizontal"
              currentPosition={props.currentPosition}
              hole={props.hole}
              zoomFactor={0.8}
              onMapClick={viewLogic.onMapClick}
            />
          )}
        </Box>
        {/* <Flex flexDir="row" alignItems={"center"} columnGap={4}>
          <Text variant="inputLabel" minWidth={inputLabelWidth}>
            Target
          </Text>
          <Text><em>todo</em></Text>
        </Flex> */}
        <Flex flexDir="column" rowGap={3}>
          <Flex flexDir="row" alignItems={"center"} columnGap={4}>
            <Text variant="inputLabel" minWidth={inputLabelWidth}>
              Shot
            </Text>
            <Box flex={1}>
              <CustomModalSelect
                selectedText={
                  props.stroke.club
                    ? shortClubNames[props.stroke.club]
                    : undefined
                }
                placeholder="Club"
                onOpen={() => viewLogic.setActiveModal(Modals.Club)}
              />
            </Box>
            <Box flex={1}>
              <CustomModalSelect
                selectedText={props.stroke.strokeType}
                placeholder="Club"
                onOpen={() => viewLogic.setActiveModal(Modals.Shot)}
              />
            </Box>
          </Flex>
          {viewLogic.usingCaddie && (
            <Flex columnGap={4}>
              <Text variant="inputLabel" minWidth={inputLabelWidth}>
                Caddie
              </Text>
              <Button variant="link" onClick={viewLogic.adoptCaddySuggestion}>
                <Text variant="text" fontWeight="medium">
                  {/* todo: move to viewLogic */}
                  {props.caddySuggestions?.[0]?.club &&
                  props.caddySuggestions?.[0]?.clubDistance ? (
                    <>
                      {shortClubNames[props.caddySuggestions[0]?.club]} (
                      {props.caddySuggestions[0]?.strokeType})
                      {props.caddySuggestions[0]?.clubDistance[0] > 0 && (
                        <>
                          {" - "}
                          {props.caddySuggestions[0]?.clubDistance[0]}
                          {props.distanceUnit} (
                          {props.caddySuggestions[0]?.clubDistance[1][0]}-
                          {props.caddySuggestions[0]?.clubDistance[1][1]}
                          {props.distanceUnit})
                        </>
                      )}
                    </>
                  ) : !props.caddySuggestions?.[0]?.club &&
                    !props.caddySuggestions?.[0]?.clubDistance &&
                    props.currentPosition &&
                    !viewLogic.pinPlayedUsed ? (
                    <em>Set a target (todo: always uses Pin)</em>
                  ) : (
                    <em>Caddie N/A</em>
                  )}
                </Text>
              </Button>
            </Flex>
          )}
        </Flex>
        <Flex flexDir="row" alignItems={"center"} columnGap={4}>
          <Text variant="inputLabel" minWidth={inputLabelWidth}>
            From
          </Text>
          <Flex flex={1} flexDir={"row"}>
            <DropdownButton
              buttonText={viewLogic.fromPosButtonText[0]}
              buttonTextSmall={viewLogic.fromPosButtonText[1]}
              selectedValue={props.stroke.fromPosSetMethod}
              options={props.fromPosOptions}
              onSelectChange={viewLogic.setFromPosMethod}
              onClick={viewLogic.setFromPosOnClick}
              buttonColor={viewLogic.fromPosButtonColor}
            />
          </Flex>
          <Box flex={1}>
            <CustomModalSelect
              selectedText={
                props.stroke.fromLie
                  ? shortLieNames[props.stroke.fromLie as Lie] ||
                    props.stroke.fromLie
                  : undefined
              }
              placeholder="Select Lie"
              onOpen={() => viewLogic.setActiveModal(Modals.FromLie)}
            />
          </Box>
        </Flex>
        <Flex flexDir="row" alignItems={"center"} columnGap={4}>
          <Text variant="inputLabel" minWidth={inputLabelWidth}>
            To
          </Text>
          <Box flex={1}>
            <DropdownButton
              buttonText={viewLogic.toPosButtonText[0]}
              buttonTextSmall={viewLogic.toPosButtonText[1]}
              selectedValue={props.stroke.toPosSetMethod}
              options={props.toPosOptions}
              onSelectChange={viewLogic.setToPosMethod}
              onClick={viewLogic.setToPosOnClick}
              buttonColor={viewLogic.toPosButtonColor}
            />
          </Box>
          <Box flex={1}>
            {props.stroke.toPosSetMethod !== PosOptionMethods.HOLE && (
              <CustomModalSelect
                selectedText={
                  props.stroke.toLie
                    ? shortLieNames[props.stroke.toLie] || props.stroke.toLie
                    : undefined
                }
                placeholder="Select Lie"
                onOpen={() => viewLogic.setActiveModal(Modals.ToLie)}
              />
            )}
          </Box>
        </Flex>

        {/* <Button
          variant="link"
          onClick={
            viewLogic.usingCaddie ? viewLogic.hideCaddie : viewLogic.showCaddie
          }
        >
          (for options) {viewLogic.usingCaddie ? "Hide" : "Show"} Caddie
        </Button> */}
      </Flex>
    </Box>
  );
}
