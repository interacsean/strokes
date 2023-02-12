import { extendTheme } from "@chakra-ui/react";
import SelectTheme from "./chakraComponents/SelectTheme";
import InputTheme from "./chakraComponents/InputTheme";
import TextTheme from "./chakraComponents/TextTheme";
import ButtonTheme from "./chakraComponents/ButtonTheme";
import SpinnerTheme from "./chakraComponents/SpinnerTheme";
import palette from "./palette";

const customTheme = {
  colors: palette,
  components: {
    Select: SelectTheme,
    Input: InputTheme,
    Text: TextTheme,
    Button: ButtonTheme,
    Spinner: SpinnerTheme,
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  breakpoints: {
    sm: "320px",
    md: "768px", // tablet
    lg: "980px", // tabletLarge
    xl: "1024px", // desktop
    "2xl": "1280px", // desktopLarge
  },
};

const theme = extendTheme(customTheme);

export default theme;
