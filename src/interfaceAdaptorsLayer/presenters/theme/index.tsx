import { ChakraProvider } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import theme from './chakraTheme';

export function ThemedChakraProvider({ children }: PropsWithChildren<{}>) {
  return (
    <ChakraProvider theme={theme}>
      { children }
    </ChakraProvider>
  )
}