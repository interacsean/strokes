const ButtonTheme = {
  baseStyle: {
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
      backgroundColor: "transparent",
      borderWidth: "2px",
      borderColor: "primary.500",
      color: "primary.500",
    },
    ghost: {},
  },
  defaultProps: {
    variant: "primary",
  },
};

export default ButtonTheme;
