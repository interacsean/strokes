import { Flex } from "@chakra-ui/react";
import { withTheme } from "@emotion/react";
import styled from "@emotion/styled";

// @ts-ignore
export const Container = withTheme(({ theme, children }) => console.log(theme) || (
  <Flex maxW={theme.breakpoints.md} >{children}</Flex>
));

