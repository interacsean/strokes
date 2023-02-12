import palette from "../palette";
import TextTheme from "./TextTheme";

const InputTheme = {
  baseStyle: {
    field: {
      _placeholder: {
        color: palette.placeholder[100],
      },
    },
  },
  sizes: {
    sm: {
      field: {
        // @ts-ignore ok
        fontSize: TextTheme.variants.text.fontSize,
      },
    },
  },
  variants: {
    outline: {
      field: {
        borderColor: "guide.500",
      },
    },
  },
  defaultProps: {
    size: "sm",
  },
};

export default InputTheme;
