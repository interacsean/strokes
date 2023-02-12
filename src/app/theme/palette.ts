const colorPalette = {
  primary: {
    500: "#de9f2c",
  },
  secondary: {
    500: "#de412c",
  },
  white: "#ffffff",
  black: "#161616",
  tertiary: {
    500: "#222222",
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

export default {
  ...colorPalette,
  ...elementColors,
};
