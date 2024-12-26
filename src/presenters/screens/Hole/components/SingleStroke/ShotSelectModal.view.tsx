import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { StrokeType, StrokeTypeLabels } from "model/StrokeType";
import { Modal } from "presenters/components/Modal/Modal";

type ShotSelectModalprops = {
  selectStroke: (stroke: StrokeType) => void;
  cancel: () => void;
};

// const strokeTypesSet: Record<StrokeType, StrokeType> = {
//   [StrokeType.FULL]: StrokeType.FULL,
//   [StrokeType.THREE_QTR]: StrokeType.THREE_QTR,
//   [StrokeType.PITCH]: StrokeType.PITCH,
//   [StrokeType.FLOP]: StrokeType.FLOP,
//   [StrokeType.CHIP]: StrokeType.CHIP,
//   [StrokeType.PUTT]: StrokeType.PUTT,
//   [StrokeType.PUNCH]: StrokeType.PUNCH,
//   [StrokeType.LOW]: StrokeType.LOW,
//   [StrokeType.HIGH]: StrokeType.HIGH,
//   [StrokeType.DRAW]: StrokeType.DRAW,
//   [StrokeType.FADE]: StrokeType.FADE,
//   [StrokeType.OTHER]: StrokeType.OTHER,
// };
// const strokeTypes: StrokeType[] = Object.values(strokeTypesSet);

const StrokeTypeButton = (props: { strokeType: StrokeType, selectStroke: (stroke: StrokeType) => void }) => {
  return (
    <Button variant="ghost" onClick={() => props.selectStroke(props.strokeType)}>
      {StrokeTypeLabels[props.strokeType]}
    </Button>
  )
}

export function ShotSelectModal(props: ShotSelectModalprops) {
  return (
    <Modal onClose={props.cancel}>
      <Box mt={8}>
        <Text variant="solidLabel">Full</Text>
        <Flex rowGap={2} flexDir={"column"} alignItems={"center"} mt={3} mb={8}>
          <Flex columnGap={2}>
            <StrokeTypeButton strokeType={StrokeType.HIGH_FADE} selectStroke={props.selectStroke} />
            <StrokeTypeButton strokeType={StrokeType.HIGH} selectStroke={props.selectStroke} />
            <StrokeTypeButton strokeType={StrokeType.HIGH_DRAW} selectStroke={props.selectStroke} />
          </Flex>
          <Flex columnGap={2}>
            <StrokeTypeButton strokeType={StrokeType.FADE} selectStroke={props.selectStroke} />
            <StrokeTypeButton strokeType={StrokeType.FULL} selectStroke={props.selectStroke} />
            <StrokeTypeButton strokeType={StrokeType.DRAW} selectStroke={props.selectStroke} />
          </Flex>
          <Flex columnGap={2}>
            <StrokeTypeButton strokeType={StrokeType.LOW_FADE} selectStroke={props.selectStroke} />
            <StrokeTypeButton strokeType={StrokeType.LOW} selectStroke={props.selectStroke} />
            <StrokeTypeButton strokeType={StrokeType.LOW_DRAW} selectStroke={props.selectStroke} />
          </Flex>
        </Flex>
        <Text variant="solidLabel">Partial</Text>
        <Flex columnGap={2} mb={8} justifyContent={"center"}>
          <StrokeTypeButton strokeType={StrokeType.THREE_QTR} selectStroke={props.selectStroke} />
          <StrokeTypeButton strokeType={StrokeType.PITCH} selectStroke={props.selectStroke} />
          <StrokeTypeButton strokeType={StrokeType.FLOP} selectStroke={props.selectStroke} />
          <StrokeTypeButton strokeType={StrokeType.PUNCH} selectStroke={props.selectStroke} />
        </Flex>
        <Text variant="solidLabel">Greens</Text>
        <Flex flex={1} mb={8}>
          <Flex columnGap={2} flex={1}>
            <StrokeTypeButton strokeType={StrokeType.CHIP} selectStroke={props.selectStroke} />
            <StrokeTypeButton strokeType={StrokeType.PUTT} selectStroke={props.selectStroke} />
          </Flex>
          <Flex columnGap={2}>
            <StrokeTypeButton strokeType={StrokeType.OTHER} selectStroke={props.selectStroke} />
          </Flex>
        </Flex>
      </Box>
      {/* {strokeTypes.map((strokeType) => (
        // todo: stroke image
        <Button
          key={strokeType}
          variant="ghost"
          onClick={() => props.selectStroke(strokeType)}
        >
          {strokeType}
        </Button>
      ))} */}
    </Modal>
  );
}
