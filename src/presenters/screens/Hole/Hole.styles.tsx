import { Flex } from "@chakra-ui/react";
import { withTheme } from "@emotion/react";

// @ts-ignore
export const Container = withTheme(({ theme, children }) => (
  <Flex flexDir="column" rowGap={2}>
    {children}
  </Flex>
));

// @ts-ignore
export const StrokesContainer = withTheme(({ theme, children }) => (
  <Flex
    flexDir="column"
    margin="0 auto"
    maxW={theme.breakpoints.md}
    alignItems="stretch"
  >
    {children}
  </Flex>
));
