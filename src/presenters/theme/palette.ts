const colorPalette = {
  primary: {
    200: "#D9EDFF",
    500: "#0088cc",
    700: "#3A7FBE",
    900: "#0F4B83",
  },
  secondary: {
    500: "#FF7051",
  },
  white: "#ffffff",
  black: "#161616",
  tertiary: {
    500: "#222222",
  },
  neutral: {
    100: "#F4F4F4",
    500: "#CDCBCB",
    800: "#686868",
  },
  action: {
    400: "#707f9f",
    500: "#0099ff",
  },
};

const elementColors = {
  text: {
    100: colorPalette.white,
    900: colorPalette.black,
  },
  heading: {
    100: "#003366",
    200: "#8e0606",
    300: "#292626",
  },
  guide: {
    100: "#d2d2d2",
  },
  link: {
    100: "#acdeff",
    500: "#0c08c2",
  },
  panel: {
    100: "#dee5ef",
    900: "#051c30",
  },
  placeholder: {
    100: "#A5A5A5",
  },
  disabled: {
    100: "#7c7c7c",
  },
};

const palette = {
  ...colorPalette,
  ...elementColors,
};

export default palette;
