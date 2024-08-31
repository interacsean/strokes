import { Button } from "@chakra-ui/react";
import { Club } from "model/Club";
import { Modal } from "presenters/components/Modal/Modal";

type ClubSelectModalProps = {
  clubs: {
    club: Club;
    clubImage?: string;
  }[];
  selectClub: (clubId: Club) => void;
  cancel: () => void;
};

export function ClubSelectModal(props: ClubSelectModalProps) {
  return (
    <Modal onClose={props.cancel}>
      {props.clubs.map((club) => (
        <Button
          key={club.club}
          variant="ghost"
          onClick={() => props.selectClub(club.club)}
        >
          {club.club}
        </Button>
      ))}
    </Modal>
  );
}
