import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { CustomModalSelect } from "presenters/components/CustomModalSelect/CustomModalSelect";
import { StrokeWithDerivedFields } from "model/Stroke";
import { HoleViewProps } from "../../Hole.view";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ClubSelectModal } from "./ClubSelectModal.view";
import { Club } from "model/Club";
import { ShotSelectModal } from "./ShotSelectModal.view";
import { LieSelectModal } from "./LieSelectModal.view";
import { DropdownButton } from "presenters/components/DropdownButton/DropdownButton";
import { Hole } from "model/Hole";
import { PosOption, PosOptionMethods } from "model/PosOptions";
import { LatLng } from "model/LatLng";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";
import { Lie } from "model/Lie";
import Map from "presenters/components/Map/Map";
import { ClubStats } from "model/ClubStats";
import { CaddySuggestion } from "usecases/stroke/calculateCaddySuggestions";

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
  clubStats: ClubStats;
  caddySuggestions: CaddySuggestion[];
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
    hole: { pinPlayed, pins, holeNum },
    currentPosition,
    setFromPosMethod,
    setToPosMethod,
    strokeNum,
  } = props;

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

  useEffect(
    function takeActionOnFromMethodChange() {
      if (holeNum === localHoleNum && strokeNum === localStrokeNum) {
        // fromPosSetMethod and not because of changing shots or holes
        switch (fromPosSetMethod) {
          case PosOptionMethods.CUSTOM:
            // todo: open map
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
            // todo: open map
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
      case PosOptionMethods.CUSTOM:
      case PosOptionMethods.GPS:
        return !fromPos ? "buttonUnsatisfied" : "buttonPrimary";
      case PosOptionMethods.LAST_SHOT:
        return "buttonPrimary";
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
        return !toPos ? "buttonUnsatisfied" : "buttonPrimary";
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
        // todo: open map
        break;
      case PosOptionMethods.TEE:
      // skip
    }
  }, [strokeNum, fromPosSetMethod, setFromPosition]);

  const setToPosOnClick = useCallback(() => {
    switch (toPosSetMethod) {
      case PosOptionMethods.GPS:
        setToPosition(strokeNum);
        break;
      case PosOptionMethods.CUSTOM:
        // todo: open map
        break;
    }
  }, [toPosSetMethod, setToPosition, strokeNum]);

  const closeModal = () => setActiveModal(null);

  const [usingCaddie, setShowCaddie] = useState(true);
  const showCaddie = () => setShowCaddie(true);
  const hideCaddie = () => setShowCaddie(false);
  const caddySuggestions = useMemo(() => {}, []);

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
    caddySuggestions,
    pinPlayedUsed,
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
    <>
      {modal}
      <Flex
        flexDir="column"
        rowGap={5}
        visibility={viewLogic.activeModal ? "hidden" : "visible"}
      >
        <Flex flexDir="row" alignItems={"center"} columnGap={3}>
          <Text variant="inputLabel" minWidth={inputLabelWidth}>
            Target
          </Text>
          <Text>—</Text>
        </Flex>
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
            />
          )}
        </Box>
        <Flex flexDir="column" rowGap={3}>
          <Flex flexDir="row" alignItems={"center"} columnGap={2}>
            <Text variant="inputLabel" minWidth={inputLabelWidth}>
              Shot
            </Text>
            <Box flex={1}>
              <CustomModalSelect
                selectedText={props.stroke.club}
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
            <Flex ml={inputLabelWidth}>
              <Text variant="minor">
                {/* todo: move to viewLogic */}
                {props.caddySuggestions?.[0]?.club &&
                props.caddySuggestions?.[0]?.clubDistance ? (
                  <>
                    {props.caddySuggestions[0]?.club} -{" "}
                    {props.caddySuggestions[0]?.clubDistance[0]}
                    {props.distanceUnit} (
                    {props.caddySuggestions[0]?.clubDistance[1][0]}-
                    {props.caddySuggestions[0]?.clubDistance[1][1]}
                    {props.distanceUnit})
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
            </Flex>
          )}
        </Flex>
        <Flex flexDir="row" alignItems={"center"} columnGap={2}>
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
              selectedText={props.stroke.fromLie}
              placeholder="Select Lie"
              onOpen={() => viewLogic.setActiveModal(Modals.FromLie)}
            />
          </Box>
        </Flex>
        <Flex flexDir="row" alignItems={"center"} columnGap={2}>
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
                selectedText={props.stroke.toLie || undefined}
                placeholder="Select Lie"
                onOpen={() => viewLogic.setActiveModal(Modals.ToLie)}
              />
            )}
          </Box>
        </Flex>

        <Button
          variant="link"
          onClick={
            viewLogic.usingCaddie ? viewLogic.hideCaddie : viewLogic.showCaddie
          }
        >
          (for options) {viewLogic.usingCaddie ? "Hide" : "Show"} Caddie
        </Button>
      </Flex>
    </>
  );
}
