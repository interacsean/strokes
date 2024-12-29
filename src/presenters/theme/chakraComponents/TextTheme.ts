import fontFamilies from "../fontFamilies";
import palette from "../palette";
import fontWeights from "../fontWeights";

const clickableProps = {
  color: palette.link["500"],
  cursor: "pointer",
  _active: {
    opacity: 0.6,
  },
};

const makeVariants = (name: string, def: {}) => ({
  [name]: def,
  [`${name}-clickable`]: {
    ...def,
    ...clickableProps,
  },
  [`${name}-link`]: {
    ...def,
    ...clickableProps,
    textDecoration: "underline",
  },
  [`${name}-linkSubtle`]: {
    ...def,
    ...clickableProps,
    lineHeight: "110%",
    borderBottom: "1px dashed currentColor",
  },
});

const TextTheme = {
  variants: {
    heading: {
      fontSize: `${26 / 16}rem`,
      fontFamily: fontFamilies.heading,
      fontWeight: fontWeights.bold,
      color: palette.heading[100],
    },
    heading2: {
      fontSize: `${22.5 / 16}rem`,
      fontFamily: fontFamilies.content,
      fontWeight: fontWeights.black,
      color: palette.heading[200],
    },
    heading3: {
      fontSize: `${19 / 16}rem`,
      fontFamily: fontFamilies.content,
      fontWeight: fontWeights.black,
      color: palette.heading[100],
    },
    assertive: {
      fontFamily: fontFamilies.content,
      fontWeight: fontWeights.bold,
      fontSize: `${14 / 16}rem`,
      color: palette.neutral[800]
    },
    solidLabel: {
      fontFamily: fontFamilies.content,
      fontWeight: fontWeights.bold,
      fontSize: `${12 / 16}rem`,
      color: palette.heading[100],
      textTransform: "uppercase",
    },
    button: {
      fontFamily: fontFamilies.content,
      fontWeight: fontWeights.bold,
      fontSize: `${14 / 16}rem`,
    },
    buttonSub: {
      fontFamily: fontFamilies.content,
      fontWeight: fontWeights.bold,
      fontSize: `${11.5 / 16}rem`,
    },
    inputLabel: {
      fontFamily: fontFamilies.content,
      fontSize: `${14 / 16}rem`,
      color: palette.heading[100],
      textTransform: "uppercase",
    },
    ...makeVariants("content", {
      fontSize: "1rem",
      fontFamily: fontFamilies.content,
      fontWeight: fontWeights.medium,
    }),
    ...makeVariants("text", {
      fontSize: `${14.5 / 16}rem`,
      fontFamily: fontFamilies.content,
      fontWeight: fontWeights.medium,
    }),
    ...makeVariants("minor", {
      fontSize: `${13.25 / 16}rem`,
      fontFamily: fontFamilies.content,
      fontWeight: fontWeights.medium,
    }),
    ...makeVariants("area-heading", {
      fontSize: `${14.5 / 16}rem`,
      fontFamily: fontFamilies.content,
      fontWeight: fontWeights.extraBold,
    }),
  },
  defaultProps: {
    variant: "text",
  },
};

export default TextTheme;
