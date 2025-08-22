import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { CustomModalSelect } from "presenters/components/CustomModalSelect/CustomModalSelect";
import { StrokeWithDerivedFields } from "model/Stroke";
import { HoleViewProps } from "../../Hole.view";
import { useCallback, useMemo, useState } from "react";
import { ClubSelectModal } from "./ClubSelectModal.view";
import { Club, shortClubNames } from "model/Club";
import { ShotSelectModal } from "./ShotSelectModal.view";
import { LieSelectModal } from "./LieSelectModal.view";
import { DropdownButton } from "presenters/components/DropdownButton/DropdownButton";
import { Hole, Tee } from "model/Hole";
import { PosOption, PosOptionMethods } from "model/PosOptions";
import { LatLng } from "model/LatLng";
import { Lie, shortLieNames } from "model/Lie";
import Map from "presenters/components/Map/Map";
import { ClubStats } from "model/ClubStats";
import { CaddySuggestion } from "usecases/stroke/calculateCaddySuggestions";
import { StrokeTypeLabels } from "model/StrokeType";

export type SingleStrokeViewProps = {
  hole: Hole;
  pinPlayedPos: LatLng | undefined;
  teePlayedPos: Tee | undefined
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
  setPendingPos: (params: ["to" | "from", LatLng, number | undefined]) => void;
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
  distSinceFromPos: number | null;
  onFromPosClick: () => void;
  onToPosClick: () => void;
  mapClickAction: "from" | "to" | null;
  onMapClick: undefined | ((latLng: LatLng) => void);
  acceptCaddySuggestion: () => void;
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
    fromPosOptions,
    toPosOptions,
    stroke: { fromPosSetMethod, fromPos, toPosSetMethod, toPos, fromLie, toLie },
    hole: { strokes },
    setFromPosMethod,
    setToPosMethod,
    setPendingPos,
    strokeNum,
    prevStroke,
    distSinceFromPos,
    currentPosition,
  } = props;

  const ballMapPos = useMemo(() => {
    return strokes[strokeNum - 1]?.toPos || strokes[strokeNum - 1]?.fromPos || null;
  }, [strokes, strokeNum]);

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
  }, [fromPosSetMethod, fromPos, prevStroke?.toPos]);

  const setGpsText = useMemo(() => {
    const roundedShotDist = Math.round(props.stroke.strokeDistance || 0);
    return [
      "Set GPS",
      ...(distSinceFromPos
        ? [
            roundedShotDist === distSinceFromPos
              ? undefined
              : `⏵ ${distSinceFromPos}${props.distanceUnit} ⏴`,
          ]
        : []),
    ];
  }, [props.stroke.strokeDistance, props.distanceUnit, distSinceFromPos]);

  const toPosButtonText = useMemo(() => {
    if (props.stroke.toPosSetMethod === PosOptionMethods.GPS) {
      return setGpsText;
    }
    const matchingTPO = toPosOptions.find(
      (toPosOp) => toPosOp.value === props.stroke.toPosSetMethod
    );
    return [matchingTPO?.buttonText, matchingTPO?.buttonTextSmall];
  }, [
    setGpsText,
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
    [strokeNum, setToPosMethod],
  );

  const greenViewGpsButtonColor = useMemo(() => {
    return !toPos ? "buttonUnsatisfied"
      : toPosSetMethod === PosOptionMethods.GPS ? "buttonPrimary"
      : "buttonPrimaryOutline";
  }, [toPos, toPosSetMethod]);
  const greenViewHoledButtonColor = useMemo(() => {
    return !toPos ? "unsatisfied"
      : toPosSetMethod === PosOptionMethods.HOLE ? "primary"
      : "primaryOutline";
  }, [toPos, toPosSetMethod]);
  const greenViewNearButtonColor = useMemo(() => {
    return !toPos ? "unsatisfied"
      : toPosSetMethod === PosOptionMethods.NEAR_PIN ? "primary"
      : "primaryOutline";
  }, [toPos, toPosSetMethod]);
  
  const greenViewSetToPosFromGps = useCallback(() => {
    if (currentPosition) {
      viewSetToPosMethod(PosOptionMethods.GPS);
      setPendingPos(['to', currentPosition, undefined]);
    }
  }, [setPendingPos, currentPosition, viewSetToPosMethod]);

  const closeModal = () => setActiveModal(null);

  const [usingCaddie, setShowCaddie] = useState(true);
  const showCaddie = () => setShowCaddie(true);
  const hideCaddie = () => setShowCaddie(false);

  const showGreenView = useMemo(() => {
    return toLie && ([Lie.GREEN] as string[]).includes(toLie)
  }, [toLie]);

  return {
    fromPosButtonText,
    setGpsText,
    greenViewGpsButtonColor,
    greenViewHoledButtonColor,
    greenViewNearButtonColor,
    setFromPosMethod: viewSetFromPosMethod,
    fromPosButtonColor,
    toPosButtonText,
    toPosButtonColor,
    setToPosMethod: viewSetToPosMethod,
    activeModal,
    setActiveModal,
    clubOptions,
    closeModal,
    showCaddie,
    hideCaddie,
    usingCaddie,
    ballMapPos,
    showGreenView,
    greenViewSetToPosFromGps,
  };
}

const inputLabelWidth = "3.5rem";

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
              ballPos={viewLogic.ballMapPos}
              zoomFactor={0.8}
              onMapClick={props.onMapClick}
            />
          )}
        </Box>
        {/* <Flex flexDir="row" alignItems={"center"} columnGap={4}>
          <Text variant="inputLabel" minWidth={inputLabelWidth}>
            Target
          </Text>
          <Text><em>todo</em></Text>
        </Flex> */}
        <Flex flexDir="column" rowGap={4}>
          <Flex flexDir="row" alignItems={"center"} columnGap={4}>
            <Text variant="inputLabel" minWidth={inputLabelWidth}>
              From
            </Text>
            {props.stroke.fromPosSetMethod === PosOptionMethods.LAST_SHOT ? (
              <Flex flex={1} flexDir={"row"} justifyContent={"center"} alignItems={"baseline"} mb={"2px"}>
                <Text variant="text" fontWeight="medium">As it lies</Text>&nbsp;
                <Button variant="link" position="relative">
                  <select
                    onChange={(e) => {
                      viewLogic.setFromPosMethod(e.target.value);
                    }}
                    value={props.stroke.fromPosSetMethod}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      cursor: "pointer",
                    }}
                  >
                    {props.fromPosOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <Text variant="text" fontWeight="medium">Drop/Move</Text>
                </Button>
              </Flex>
            ) : (
              <>
                <Flex flex={1} flexDir={"row"}>
                  <DropdownButton
                    buttonText={viewLogic.fromPosButtonText[0]}
                    buttonTextSmall={viewLogic.fromPosButtonText[1]}
                    selectedValue={props.stroke.fromPosSetMethod}
                    options={props.fromPosOptions}
                    onSelectChange={viewLogic.setFromPosMethod}
                    onClick={props.onFromPosClick}
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
              </>
            )}
          </Flex>
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
                selectedText={props.stroke.strokeType ? StrokeTypeLabels[props.stroke.strokeType] : undefined}
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
              <Button variant="link" onClick={props.acceptCaddySuggestion}>
                <Text variant="text" fontWeight="medium">
                  {/* todo: move to viewLogic */}
                  {props.caddySuggestions?.[0]?.club &&
                  props.caddySuggestions?.[0]?.clubDistance ? (
                    <>
                      {shortClubNames[props.caddySuggestions[0]?.club]} (
                      {StrokeTypeLabels[props.caddySuggestions[0]?.strokeType]})
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
                    !props.pinPlayedPos ? (
                    <em>Set a target (todo: always uses Pin)</em>
                  ) : (
                    <em>Caddie N/A</em>
                  )}
                </Text>
              </Button>
            </Flex>
          )}
        </Flex>
        <Flex flexDir="column" rowGap={1}>
          <Flex flexDir="row" alignItems={"center"} columnGap={4}>
            <Text variant="inputLabel" minWidth={inputLabelWidth}>
              To
            </Text>
            {viewLogic.showGreenView ? (
              <Flex flex={1} flexDir={"row"} justifyContent={"center"} alignItems={"center"}>
                <Button
                  variant={viewLogic.greenViewHoledButtonColor}
                  onClick={() => viewLogic.setToPosMethod(PosOptionMethods.HOLE)}
                  width="33%" 
                  borderRightRadius={0}
                  mr="3px">
                  Holed
                </Button>
                <Button
                  variant={viewLogic.greenViewNearButtonColor}
                  onClick={() => viewLogic.setToPosMethod(PosOptionMethods.NEAR_PIN)}
                  width="33%" 
                  borderRightRadius={0}
                  borderLeftRadius={0}
                  mr="3px"
                >
                  Near<br/>Pin
                </Button>
                <Box width="calc(33% + 32px)" >
                  <DropdownButton
                    buttonStyle={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    buttonText={"Set"}
                    buttonTextSmall={viewLogic.setGpsText[1]}
                    selectedValue={props.stroke.toPosSetMethod}
                    options={props.toPosOptions}
                    onSelectChange={viewLogic.setToPosMethod}
                    onClick={viewLogic.greenViewSetToPosFromGps}
                    buttonColor={viewLogic.greenViewGpsButtonColor}
                  />
                </Box>
              </Flex>
            ) : (
              <>
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
                <Box flex={1}>
                  <DropdownButton
                    buttonText={viewLogic.toPosButtonText[0]}
                    buttonTextSmall={viewLogic.toPosButtonText[1]}
                    selectedValue={props.stroke.toPosSetMethod}
                    options={props.toPosOptions}
                    onSelectChange={viewLogic.setToPosMethod}
                    onClick={props.onToPosClick}
                    buttonColor={viewLogic.toPosButtonColor}
                  />
                </Box>
              </>
            )}
          </Flex>
          <Flex justifyContent="space-between">
            <Box ml={inputLabelWidth} pl={4}>
              {props.stroke.strokeDistance && (
                <Text variant="assertive">Total: {Math.round(props.stroke.strokeDistance)}{props.distanceUnit}</Text>
              )}
            </Box>
            {viewLogic.showGreenView && (
              <Button variant="link" onClick={() => viewLogic.setActiveModal(Modals.ToLie)}>Leave Green View</Button>
            )}
          </Flex>
          <Flex>
            {/* Strike quality here */}
          </Flex>
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
