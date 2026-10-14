export type ScreenPoint = { x: number; y: number };
export type ScreenSize = { width: number; height: number };
/** Top left corner and size. */
export type ScreenBox = ScreenPoint & ScreenSize;

const sub = (a: ScreenPoint, b: ScreenPoint) => ({
  x: a.x - b.x,
  y: a.y - b.y,
});
const dot = (a: ScreenPoint, b: ScreenPoint) => a.x * b.x + a.y * b.y;
const clamp = (value: number, min: number, max: number) =>
  max < min ? (min + max) / 2 : Math.min(Math.max(value, min), max);

function normalise(v: ScreenPoint): ScreenPoint | null {
  const length = Math.hypot(v.x, v.y);
  return length > 0 ? { x: v.x / length, y: v.y / length } : null;
}

function overlapArea(a: ScreenBox, b: ScreenBox) {
  const width = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const height = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  return width > 0 && height > 0 ? width * height : 0;
}

function isInside(
  point: ScreenPoint | null,
  viewport: ScreenSize,
  inset: number
): point is ScreenPoint {
  return (
    !!point &&
    Number.isFinite(point.x) &&
    Number.isFinite(point.y) &&
    point.x >= inset &&
    point.x <= viewport.width - inset &&
    point.y >= inset &&
    point.y <= viewport.height - inset
  );
}

/**
 * The stretch of a line that is on screen, from points sampled along it in
 * order. Only the first unbroken stretch counts: past the far edge of a tilted
 * map, points can project back onto the screen nowhere near the line.
 */
export function visibleRun(
  samples: (ScreenPoint | null)[],
  viewport: ScreenSize,
  inset = 0
): [ScreenPoint, ScreenPoint] | null {
  const start = samples.findIndex((sample) =>
    isInside(sample, viewport, inset)
  );
  if (start === -1) return null;

  let end = start;
  while (
    end + 1 < samples.length &&
    isInside(samples[end + 1], viewport, inset)
  ) {
    end++;
  }
  return [samples[start] as ScreenPoint, samples[end] as ScreenPoint];
}

/** How far along the visible stretch the label may sit, best first. */
const ALONG_LINE = [0.5, 0.35, 0.65, 0.2, 0.8, 0.05, 0.95];
/** Points the label pays for each step it moves away from the line's middle,
 * or for sitting on the less natural side of it. */
const ALONG_LINE_COST = 6;
const OTHER_SIDE_COST = 4;
/** Covering another label is worse than anything short of leaving the screen. */
const OVERLAP_COST = 1000;

type PlaceLineLabelParams = {
  /** The visible stretch of the line, starting from the end the lines share. */
  run: [ScreenPoint, ScreenPoint];
  /** Which way the other line leaves the shared end, if there is one. The label
   * sits on the far side, out of the angle between the two. */
  otherDirection: ScreenPoint | null;
  label: ScreenSize;
  viewport: ScreenSize;
  /** Room left between the line and the nearest edge of the label. */
  gap: number;
  /** Room left between the label and the edge of the screen. */
  inset: number;
  /** Labels already placed, which this one must not cover. */
  avoid?: ScreenBox[];
};

/**
 * Where to put a label beside a line on screen: off to one side of the line's
 * middle, with whichever edge or corner of the label faces the line set just
 * clear of it — so a label beside an upright line is aligned to it on the left
 * or right, and one beside a flat line sits centred above or below it.
 *
 * Kept on screen by trying the other side of the line and spots further along
 * it, and as a last resort by pushing it in from the edge.
 */
export function placeLineLabel({
  run: [start, end],
  otherDirection,
  label,
  viewport,
  gap,
  inset,
  avoid = [],
}: PlaceLineLabelParams): ScreenBox {
  const along = sub(end, start);
  const direction = normalise(along) ?? { x: 1, y: 0 };
  const normal = { x: -direction.y, y: direction.x };
  const flipped = { x: -normal.x, y: -normal.y };

  const awayFromOther = otherDirection && normalise(otherDirection);
  const preferred = awayFromOther
    ? dot(normal, awayFromOther) > 0
      ? flipped
      : normal
    : // With only the one line, above it reads most naturally.
    normal.y <= 0
    ? normal
    : flipped;
  const sides = [
    { normal: preferred, cost: 0 },
    { normal: preferred === normal ? flipped : normal, cost: OTHER_SIDE_COST },
  ];

  let best: { box: ScreenBox; cost: number } | null = null;

  for (let step = 0; step < ALONG_LINE.length; step++) {
    const t = ALONG_LINE[step];
    const anchor = { x: start.x + along.x * t, y: start.y + along.y * t };

    for (const side of sides) {
      // How far the label's centre has to sit from the line for its nearest
      // edge or corner to clear it by the gap.
      const extent =
        (Math.abs(side.normal.x) * label.width +
          Math.abs(side.normal.y) * label.height) /
        2;
      const centre = {
        x: anchor.x + side.normal.x * (gap + extent),
        y: anchor.y + side.normal.y * (gap + extent),
      };
      const box = {
        x: clamp(
          centre.x - label.width / 2,
          inset,
          viewport.width - inset - label.width
        ),
        y: clamp(
          centre.y - label.height / 2,
          inset,
          viewport.height - inset - label.height
        ),
        width: label.width,
        height: label.height,
      };

      const pushedIn = Math.hypot(
        box.x + label.width / 2 - centre.x,
        box.y + label.height / 2 - centre.y
      );
      const overlap = avoid.reduce(
        (total, other) => total + overlapArea(box, other),
        0
      );
      const cost =
        pushedIn +
        side.cost +
        step * ALONG_LINE_COST +
        (overlap > 0 ? OVERLAP_COST + overlap : 0);

      if (!best || cost < best.cost) best = { box, cost };
    }
  }

  return best!.box;
}
