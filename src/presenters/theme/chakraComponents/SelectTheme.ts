import { mergeDeepRight } from "ramda";
import TextTheme from "./TextTheme";

const defaultOutlineStyles = {
  field: {
    border: "1px solid",
    borderColor: "guide.500",
    bg: "inherit",
    _hover: {
      borderColor: "gray.300",
    },
    _readOnly: {
      boxShadow: "none !important",
      userSelect: "all",
    },
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
    _invalid: {
      borderColor: "#E53E3E",
      boxShadow: "0 0 0 1px #E53E3E",
    },
    _focus: {
      zIndex: 1,
      borderColor: "#3182ce",
      boxShadow: "0 0 0 1px #3182ce",
    },
  },
  addon: {
    border: "1px solid",
    borderColor: "inherit",
    bg: "gray.100",
  },
};

const variantMiniBase = mergeDeepRight(defaultOutlineStyles, {
  field: {
    paddingLeft: "0.5ch",
    paddingRight: "0.5ch",
  },
  icon: {
    right: "0",
  },
});
const SelectTheme = {
  variants: {
    miniStart: mergeDeepRight(variantMiniBase, {
      field: {
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        borderRightWidth: 0,
      },
    }),
    miniMid: mergeDeepRight(variantMiniBase, {
      field: {
        borderRadius: 0,
        borderRightWidth: 0,
      },
    }),
    miniEnd: mergeDeepRight(variantMiniBase, {
      field: {
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
      },
    }),
    outline: {
      icon: {
        right: "0.15em",
      },
      field: {
        paddingRight: "1.5rem",
        borderColor: "guide.500",
      },
    },
  },
  sizes: {
    sm: {
      field: {
        // @ts-ignore (utility creates this entry)
        fontSize: TextTheme.variants.text.fontSize,
      },
    },
  },
  defaultProps: {
    size: "sm",
  },
};

export default SelectTheme;
