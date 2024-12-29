import fontFamilies from "../fontFamilies";

const ButtonTheme = {
  baseStyle: {
    fontFamily: fontFamilies.content,
    fontSize: `${13 / 16}rem`,
    "&:active": {
      opacity: 0.5,
    },
  },
  variants: {
    primary: {
      backgroundColor: "primary.500",
      color: "white",
    },
    primaryOutline: {
      fontSize: `${14 / 16}rem`,
      backgroundColor: "transparent",
      borderWidth: "1px",
      borderColor: "primary.500",
      color: "primary.500",
    },
    link: {
      backgroundColor: "transparent",
      color: "primary.500",
      fontSize: `${14 / 16}rem`,
    },
    disabledGhost: {
      backgroundColor: "transparent",
      fontSize: `${14 / 16}rem`,
      color: "gray.300",
    },
    unsatisfied: {
      backgroundColor: "buttonUnsatisfied",
      fontSize: `${14 / 16}rem`,
      borderWidth: "1px",
      border:"buttonUnsatisfiedBorder",
    },
    ghost: {
      fontSize: `${14 / 16}rem`,
    },
  },
  defaultProps: {
    variant: "primary",
  },
};

export default ButtonTheme;
