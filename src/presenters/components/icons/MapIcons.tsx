import { createIcon } from "@chakra-ui/icons";

export const ExpandIcon = createIcon({
  displayName: "ExpandIcon",
  viewBox: "0 0 24 24",
  path: (
    <path
      fill="currentColor"
      d="M4 9V4h5v2H6v3H4Zm16 0V4h-5v2h3v3h2ZM4 15v5h5v-2H6v-3H4Zm16 0v5h-5v-2h3v-3h2Z"
    />
  ),
});

export const CollapseIcon = createIcon({
  displayName: "CollapseIcon",
  viewBox: "0 0 24 24",
  path: (
    <path
      fill="currentColor"
      d="M8 4h2v6H4V8h4V4Zm8 0h-2v6h6V8h-4V4ZM8 20h2v-6H4v2h4v4Zm8 0h-2v-6h6v2h-4v4Z"
    />
  ),
});

export const GpsAccuracyIcon = createIcon({
  displayName: "GpsAccuracyIcon",
  viewBox: "0 0 24 24",
  path: (
    <>
      <path
        fill="currentColor"
        d="M13 2h-2v3.06A7.01 7.01 0 0 0 5.06 11H2v2h3.06A7.01 7.01 0 0 0 11 18.94V22h2v-3.06A7.01 7.01 0 0 0 18.94 13H22v-2h-3.06A7.01 7.01 0 0 0 13 5.06V2Zm-1 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
      />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </>
  ),
});
