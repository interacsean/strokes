import { Flex } from "@chakra-ui/react";
import { withTheme } from "@emotion/react";

export const strokeNumWidth = "1.4rem";

export const lieWidth = "6rem";

export const clubWidth = "8rem";

// @ts-ignore
export const Container = withTheme(({ theme, children }) => (
  <Flex maxW={theme.breakpoints.md} alignItems="baseline">
    {children}
  </Flex>
));
