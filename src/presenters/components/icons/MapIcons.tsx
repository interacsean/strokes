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

/** Two points with the line measured between them. */
export const MeasureIcon = createIcon({
  displayName: "MeasureIcon",
  viewBox: "0 0 24 24",
  path: (
    <>
      <path fill="currentColor" d="M6.3 16.3 16.3 6.3l1.4 1.4-10 10-1.4-1.4Z" />
      <circle cx="5" cy="19" r="3" fill="currentColor" />
      <circle cx="19" cy="5" r="3" fill="currentColor" />
      <path
        fill="currentColor"
        d="M9.6 7.2 11 5.8l1.4 1.4L11 8.6 9.6 7.2Zm6.6 6.6 1.4-1.4 1.4 1.4-1.4 1.4-1.4-1.4Z"
      />
    </>
  ),
});
