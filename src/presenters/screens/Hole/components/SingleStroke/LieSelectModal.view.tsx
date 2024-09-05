import { Button } from "@chakra-ui/react";
import { Lie } from "model/Lie";
import { Modal } from "presenters/components/Modal/Modal";

type LieSelectModalprops = {
  selectLie: (lie: Lie) => void;
  lies: Lie[];
  cancel: () => void;
};

export function LieSelectModal(props: LieSelectModalprops) {
  return (
    <Modal onClose={props.cancel}>
      {props.lies.map((lie) => (
        // todo: lie image
        <Button key={lie} variant="ghost" onClick={() => props.selectLie(lie)}>
          {lie}
        </Button>
      ))}
    </Modal>
  );
}
