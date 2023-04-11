import { Box, Flex, Text } from "@chakra-ui/react";
import {
  clubWidth,
  Container,
  lieWidth,
  strokeNumWidth,
} from "./StrokeRow.styles";

type StrokeViewProps = {};

export function StrokeHeaderView(props: StrokeViewProps) {
  return (
    <Container>
      <Box flexBasis={strokeNumWidth} />
      <Flex
        flexGrow={1}
        columnGap={2}
        justifyContent="flex-start"
        alignItems="baseline"
      >
        <Text flexBasis={lieWidth}>Lie</Text>
        <Text flexBasis={clubWidth}>Club</Text>
        <Text>To Hole</Text>
      </Flex>
    </Container>
  );
}
