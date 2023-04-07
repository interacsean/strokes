import palette from "./palette";

type ThemeCfg = {
  header?: {
    heightMobile: string | number;
    backgroundColor?: string;
    transparentBg?: boolean;
    heroImage?: string;
  };
  nav?: {
    itemColor?: string;
    activeItemColor?: string;
    separator?: "none" | "pipe" | "bullet";
    activeDecoration?: "bold" | "underline" | "altColor";
    hoverDecoration?:
      | "sameAsActive"
      | "underline"
      | "underlineSemiTransparent"
      | "thinUnderline";
    px?: string | number;
    py?: string | number;
  };
  section?: {
    vPadding?: string | number;
    maxContentWidth?: string | number;
    backgroundColor?: string;
    altBackgroundColor?: string;
  };
  footer?: {
    vPadding: string | number;
    backgroundColor?: string;
  };
  body?: {
    hPadding?: string | number;
  };
  enableLogin?: boolean;
};

const appTheme: ThemeCfg = {
  body: {
    hPadding: 2,
  },
  header: {
    heightMobile: 12,
    backgroundColor: palette.panel[900],
  },
  nav: {
    itemColor: palette.text[100],
    activeItemColor: palette.link[100],
    px: 3,
    py: 2,
  },
  section: {
    vPadding: 4,
    maxContentWidth: "1000px",
    backgroundColor: palette.panel[100],
    altBackgroundColor: palette.panel[900],
  },
  footer: {
    vPadding: 5,
    backgroundColor: palette.panel[100],
  },
};

export default appTheme;
