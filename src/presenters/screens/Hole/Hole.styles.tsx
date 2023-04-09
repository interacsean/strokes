import { Flex, VStack } from "@chakra-ui/react";
import { withTheme } from "@emotion/react";

// @ts-ignore
export const Container = withTheme(({ theme, children }) => (
  <Flex flexDir="column" rowGap={2}>{children}</Flex>
));

// @ts-ignore
export const StrokesContainer = withTheme(({ theme, children }) => (
  <VStack
    margin="0 auto"
    spacing={2}
    maxW={theme.breakpoints.md}
    alignItems="stretch"
  >
    {children}
  </VStack>
));
