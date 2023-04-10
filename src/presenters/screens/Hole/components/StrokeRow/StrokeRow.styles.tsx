import { Flex } from "@chakra-ui/react";
import { withTheme } from "@emotion/react";

// @ts-ignore
export const Container = withTheme(({ theme, children }) => (
  <Flex maxW={theme.breakpoints.md}>{children}</Flex>
));
