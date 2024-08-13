import { Box, Flex, Text } from "@chakra-ui/react";
import { CustomModalSelect } from "presenters/components/CustomModalSelect/CustomModalSelect";
import { StrokeWithDerivedFields } from "model/Stroke";
import { HoleViewProps } from "../../Hole.view";
import { useMemo, useState } from "react";
import { ClubSelectModal } from "./ClubSelectModal.view";
import { Club } from "model/Club";

export type SingleStrokeViewProps = {
  strokeNum: number;
  stroke: StrokeWithDerivedFields;
  selectLie: HoleViewProps["selectStrokeLie"];
  selectClub: HoleViewProps["selectStrokeClub"];
  selectStrokeType: HoleViewProps["selectStrokeType"];
  setStrokePosition: (strokeNum: number) => void;
  setLiePosition: (strokeNum: number) => void;
  clubs: Club[];
};

enum Modals {
  Club = "Club",
  Shot = "Shot",
  FromPos = "FromPos",
  FromLie = "FromLie",
  ToPos = "ToPos",
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

  return {
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
        <Flex flexDir="row" alignItems={"center"} columnGap={2}>
          <Text variant="inputLabel" minWidth={inputLabelWidth}>
            Shot
          </Text>
          <Box flex={1}>
            <CustomModalSelect
              selectedText={props.stroke.club}
              selectedValue={props.stroke.club}
              placeholder="Club"
              onOpen={() => viewLogic.setActiveModal(Modals.Club)}
            />
          </Box>
          <Box flex={1}>
            <CustomModalSelect
              selectedText={props.stroke.strokeType}
              selectedValue={props.stroke.strokeType}
              placeholder="Club"
              onOpen={() => viewLogic.setActiveModal(Modals.Club)}
            />
          </Box>
        </Flex>
        <Flex flexDir="row" alignItems={"center"} columnGap={2}>
          <Text variant="inputLabel" minWidth={inputLabelWidth}>
            From
          </Text>
          <Box flex={1}>
            <CustomModalSelect
              selectedText={"Last shot"}
              selectedValue={undefined}
              placeholder="Club"
              onOpen={() => viewLogic.setActiveModal(Modals.Club)}
            />
          </Box>
          <Box flex={1}>
            <CustomModalSelect
              selectedText={props.stroke.fromLie}
              selectedValue={props.stroke.fromLie}
              placeholder="Select Lie"
              onOpen={() => viewLogic.setActiveModal(Modals.Club)}
            />
          </Box>
        </Flex>
        <Flex flexDir="row" alignItems={"center"} columnGap={2}>
          <Text variant="inputLabel" minWidth={inputLabelWidth}>
            To
          </Text>
          <Box flex={1}>
            <CustomModalSelect
              selectedText={"Last shot"}
              selectedValue={undefined}
              placeholder="Club"
              onOpen={() => viewLogic.setActiveModal(Modals.Club)}
            />
          </Box>
          <Box flex={1}>
            <CustomModalSelect
              selectedText={props.stroke.fromLie}
              selectedValue={props.stroke.fromLie}
              placeholder="Select Lie"
              onOpen={() => viewLogic.setActiveModal(Modals.Club)}
            />
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
