import { Box, Flex, Text } from "@chakra-ui/react";
import { CustomModalSelect } from "presenters/components/CustomModalSelect/CustomModalSelect";
import { StrokeWithDerivedFields } from "model/Stroke";
import { HoleViewProps } from "../../Hole.view";
import { useCallback, useMemo, useState } from "react";
import { ClubSelectModal } from "./ClubSelectModal.view";
import { Club } from "model/Club";
import { ShotSelectModal } from "./ShotSelectModal.view";
import { LieSelectModal } from "./LieSelectModal.view";
import { DropdownButton } from "presenters/components/DropdownButton/DropdownButton";
import { Hole } from "model/Hole";
import { PosOptionMethods, PosOptions } from "model/PosOptions";

export type SingleStrokeViewProps = {
  hole: Hole;
  strokeNum: number;
  stroke: StrokeWithDerivedFields;
  selectFromLie: HoleViewProps["selectStrokeFromLie"];
  setFromPosMethod: HoleViewProps["setFromPosMethod"];
  selectToLie: HoleViewProps["selectStrokeToLie"];
  setToPosMethod: HoleViewProps["setToPosMethod"];
  selectClub: HoleViewProps["selectStrokeClub"];
  selectStrokeType: HoleViewProps["selectStrokeType"];
  setStrokePosition: (strokeNum: number) => void;
  setLiePosition: (strokeNum: number) => void;
  clubs: Club[];
};

enum Modals {
  Club = "Club",
  Shot = "Shot",
  FromLie = "FromLie",
  ToLie = "ToLie",
}

function useSingleStrokeViewLogic(props: SingleStrokeViewProps) {
  const [activeModal, setActiveModal] = useState<Modals | null>(null);

  const clubOptions = useMemo(
    () =>
      props.clubs.map((club) => ({
        club,
      })),
    [props.clubs]
  );

  const fromPosOptions = useMemo(() => {
    const fo = [PosOptions[PosOptionMethods.GPS]];
    if (props.strokeNum === 1) {
      const teeNames = Object.keys(props.hole.tees);
      if (teeNames.length === 1) {
        fo.push({
          buttonText: `Tee`,
          label: `Tee`,
          value: `${PosOptionMethods.TEE}/${teeNames[0]}`,
        });
      } else {
        teeNames.map((tee) =>
          fo.push({
            buttonText: `Tee (${tee.slice(0, 3)})`,
            label: `Tee (${tee})`,
            value: `${PosOptionMethods.TEE}/${tee}`,
          })
        );
      }
    }
    // todo: exclude if last stroke's toLie was hazard/water
    if (props.strokeNum > 1) {
      fo.push(PosOptions[PosOptionMethods.LAST_SHOT]);
    }
    fo.push(PosOptions[PosOptionMethods.CUSTOM]);
    fo.push(PosOptions[PosOptionMethods.DROP]);
    return fo;
  }, [props.hole.tees, props.strokeNum]);

  const toPosOptions = useMemo(() => {
    const to = [PosOptions[PosOptionMethods.GPS]];
    to.push(PosOptions[PosOptionMethods.CUSTOM]);
    to.push(PosOptions[PosOptionMethods.NEAR_PIN]);
    to.push(PosOptions[PosOptionMethods.HOLE]);
    return to;
  }, []);

  const fromPosButtonText = useMemo(() => {
    if (props.stroke.fromPosSetMethod === PosOptionMethods.TEE) {
      // Show which Tee based on GPS match
    }
    return PosOptions[props.stroke.fromPosSetMethod]?.buttonText || "Set";
  }, [props.stroke]);

  const toPosButtonText = useMemo(() => {
    if (props.stroke.toPosSetMethod === PosOptionMethods.TEE) {

    }
    /*
     ||
    `${Math.round(props.stroke.strokeDistance || 0) || ""}` ||
    "GPS Set"
    */
    return PosOptions[props.stroke.toPosSetMethod]?.buttonText || "Set";
  }, [props.stroke]);

  const setFromPos = useCallback((value: string) => {
    const [posMethod] = value.split("/");
    props.setFromPosMethod(props.strokeNum, posMethod as PosOptionMethods)
  }, [props.strokeNum, props.setFromPosMethod]);

  return {
    fromPosOptions,
    fromPosButtonText,
    toPosOptions,
    toPosButtonText,
    setFromPos,
    activeModal,
    setActiveModal,
    clubOptions,
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
      />
    ) : viewLogic.activeModal === Modals.FromLie ? (
      // todo: pass in valid from lies based on shot (i.e. tees)
      // todo: if from selection = last shot / disable this
      <LieSelectModal
        selectLie={(lie) => {
          props.selectFromLie(props.strokeNum, lie);
          viewLogic.setActiveModal(null);
        }}
      />
    ) : viewLogic.activeModal === Modals.Shot ? (
      <ShotSelectModal
        selectStroke={(stroke) => {
          props.selectStrokeType(props.strokeNum, stroke);
          viewLogic.setActiveModal(null);
        }}
      />
    ) : viewLogic.activeModal === Modals.ToLie ? (
      <LieSelectModal
        selectLie={(lie) => {
          props.selectToLie(props.strokeNum, lie);
          viewLogic.setActiveModal(null);
        }}
      />
    ) : null;

  return (
    <>
      {modal}
      <Flex
        flexDir="column"
        rowGap={3}
        visibility={viewLogic.activeModal ? "hidden" : "visible"}
      >
        <Flex flexDir="row" alignItems={"center"} columnGap={3}>
          <Text variant="inputLabel" minWidth={inputLabelWidth}>
            Target
          </Text>
          <Text>—</Text>
        </Flex>
        <Box bgColor="primary.200" color="white">
          [Mini-map to go here]
        </Box>
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
        <Flex flexDir="row" alignItems={"center"} columnGap={2}>
          <Text variant="inputLabel" minWidth={inputLabelWidth}>
            From
          </Text>
          <Flex flex={1} flexDir={"row"}>
            <DropdownButton
              buttonText={viewLogic.fromPosButtonText}
              selectedValue={props.stroke.fromPosSetMethod}
              options={viewLogic.fromPosOptions}
              onSelectChange={viewLogic.setFromPos}
              onClick={() => props.setLiePosition(props.strokeNum)}
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
              buttonText={viewLogic.toPosButtonText}
              selectedValue={props.stroke.toPosSetMethod}
              options={viewLogic.toPosOptions}
              onSelectChange={(value: string) => props.setToPosMethod(props.strokeNum, value as PosOptionMethods)}
              onClick={() => props.setStrokePosition(props.strokeNum)}
            />
          </Box>
          <Box flex={1}>
            <CustomModalSelect
              selectedText={props.stroke.toLie || undefined}
              placeholder="Select Lie"
              onOpen={() => viewLogic.setActiveModal(Modals.ToLie)}
            />
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
