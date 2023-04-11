import { Box, Flex, Text } from "@chakra-ui/react";
import {
  clubWidth,
  Container,
  lieWidth,
  strokeNumWidth,
  strokeTypeWidth,
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
        <Text flexBasis={strokeTypeWidth}>Stroke</Text>
        <Text>Dist.</Text>
      </Flex>
    </Container>
  );
}
