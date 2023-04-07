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
      fontSize: `${19 / 16}rem`,
      fontFamily: fontFamilies.heading,
      fontWeight: fontWeights.bold,
      color: palette.heading[100],
    },
    heading2: {
      fontSize: `1rem`,
      fontFamily: fontFamilies.content,
      fontWeight: fontWeights.black,
      color: palette.heading[200],
    },
    heading3: {
      fontSize: `1rem`,
      fontFamily: fontFamilies.content,
      fontWeight: fontWeights.black,
      color: palette.heading[100],
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
