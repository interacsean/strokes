import { Flex } from "@chakra-ui/react";
import { withTheme } from "@emotion/react";

// @ts-ignore
export const Container = withTheme(({ theme, children }) => (
  // todo: this 100vh is finicky on mobile browsers, need some smarts at this point
  <Flex flexDir="column" width="100%" height="100vh" maxHeight="100vh">
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
    height="100%"
  >
    {children}
  </Flex>
));
