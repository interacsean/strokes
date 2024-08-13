import { Button, Flex } from "@chakra-ui/react";
import { Club } from "model/Club";

type ClubSelectModalprops = {
  clubs: {
    club: Club;
    clubImage?: string; // ?
  }[];
  selectClub: (clubId: Club) => void;
};

export function ClubSelectModal(props: ClubSelectModalprops) {
  return (
    <Flex flexDir={"column"} alignItems={"stretch"} columnGap={2}>
      {props.clubs.map((club) => (
        // todo: club.clubImage
        <Button variant="ghost" onClick={() => props.selectClub(club.club)}>
          {club.club}
        </Button>
      ))}
    </Flex>
  );
}
