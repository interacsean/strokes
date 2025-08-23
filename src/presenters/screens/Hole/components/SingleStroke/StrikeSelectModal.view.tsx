import { Button, Flex } from "@chakra-ui/react";
import { Strike, StrikeLabels } from "model/Strike";
import { Modal } from "presenters/components/Modal/Modal";

type StrikeSelectModalProps = {
  selectStrike: (strike: Strike) => void;
  cancel: () => void;
};

export function StrikeSelectModal(props: StrikeSelectModalProps) {
  const strikes = Object.values(Strike);

  return (
    <Modal onClose={props.cancel}>
      <Flex justifyContent="flex-start" mb={4} flexDir="column">
        {strikes.map((strike) => (
          <Button
            key={strike}
            variant="ghost"
            fontWeight={"normal"}
            onClick={() => props.selectStrike(strike)}
          >
            {StrikeLabels[strike]}
          </Button>
        ))}
      </Flex>
    </Modal>
  );
}