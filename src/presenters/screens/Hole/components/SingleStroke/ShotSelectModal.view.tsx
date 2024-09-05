import { Button } from "@chakra-ui/react";
import { StrokeType } from "model/StrokeType";
import { Modal } from "presenters/components/Modal/Modal";

type ShotSelectModalprops = {
  selectStroke: (stroke: StrokeType) => void;
  cancel: () => void;
};

const strokeTypesSet: Record<StrokeType, StrokeType> = {
  [StrokeType.FULL]: StrokeType.FULL,
  [StrokeType.THREE_QTR]: StrokeType.THREE_QTR,
  [StrokeType.PITCH]: StrokeType.PITCH,
  [StrokeType.CHIP]: StrokeType.CHIP,
  [StrokeType.PUTT]: StrokeType.PUTT,
  [StrokeType.FLOP]: StrokeType.FLOP,
  [StrokeType.PUNCH]: StrokeType.PUNCH,
  [StrokeType.LOW]: StrokeType.LOW,
  [StrokeType.HIGH]: StrokeType.HIGH,
  [StrokeType.DRAW]: StrokeType.DRAW,
  [StrokeType.FADE]: StrokeType.FADE,
  [StrokeType.OTHER]: StrokeType.OTHER,
};
const strokeTypes: StrokeType[] = Object.values(strokeTypesSet);

export function ShotSelectModal(props: ShotSelectModalprops) {
  return (
    <Modal onClose={props.cancel}>
      {strokeTypes.map((strokeType) => (
        // todo: stroke image
        <Button
          key={strokeType}
          variant="ghost"
          onClick={() => props.selectStroke(strokeType)}
        >
          {strokeType}
        </Button>
      ))}
    </Modal>
  );
}
