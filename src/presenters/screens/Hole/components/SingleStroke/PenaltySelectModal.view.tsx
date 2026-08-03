import { Button, Flex, Text } from "@chakra-ui/react";
import {
  PenaltyReason,
  PenaltyReasonLabels,
  PenaltyRules,
} from "model/Penalty";
import { Modal } from "presenters/components/Modal/Modal";

type PenaltySelectModalProps = {
  selectReason: (reason: PenaltyReason) => void;
  reasons: PenaltyReason[];
  cancel: () => void;
};

export function PenaltySelectModal(props: PenaltySelectModalProps) {
  return (
    <Modal onClose={props.cancel}>
      {props.reasons.map((reason) => (
        <Button
          key={reason}
          variant="ghost"
          onClick={() => props.selectReason(reason)}
        >
          <Flex flex={1} justifyContent="space-between" alignItems="baseline">
            <Text variant="text">{PenaltyReasonLabels[reason]}</Text>
            <Text variant="assertive" color="penalty.900">
              +{PenaltyRules[reason].strokes}
            </Text>
          </Flex>
        </Button>
      ))}
    </Modal>
  );
}
