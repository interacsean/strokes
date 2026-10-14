import { placeLineLabel, visibleRun } from "./placeLineLabel";

const viewport = { width: 300, height: 200 };
const label = { width: 30, height: 18 };
const gap = 4;
const inset = 4;

describe("visibleRun", () => {
  it("is the whole line when it is all on screen", () => {
    expect(
      visibleRun(
        [
          { x: 10, y: 10 },
          { x: 50, y: 50 },
          { x: 90, y: 90 },
        ],
        viewport
      )
    ).toEqual([
      { x: 10, y: 10 },
      { x: 90, y: 90 },
    ]);
  });

  it("stops where the line leaves the screen", () => {
    expect(
      visibleRun(
        [
          { x: 100, y: 100 },
          { x: 200, y: 100 },
          { x: 400, y: 100 },
          // Back on screen past the edge, as a point beyond the far edge of a
          // tilted map can be.
          { x: 150, y: 150 },
        ],
        viewport
      )
    ).toEqual([
      { x: 100, y: 100 },
      { x: 200, y: 100 },
    ]);
  });

  it("starts where the line comes on screen", () => {
    expect(
      visibleRun(
        [null, { x: -50, y: 100 }, { x: 20, y: 100 }, { x: 80, y: 100 }],
        viewport
      )
    ).toEqual([
      { x: 20, y: 100 },
      { x: 80, y: 100 },
    ]);
  });

  it("is nothing when none of the line is on screen", () => {
    expect(visibleRun([{ x: -10, y: 0 }, null], viewport)).toBeNull();
  });
});

describe("placeLineLabel", () => {
  it("sits centred above a flat line", () => {
    const box = placeLineLabel({
      run: [
        { x: 50, y: 100 },
        { x: 250, y: 100 },
      ],
      otherDirection: null,
      label,
      viewport,
      gap,
      inset,
    });

    expect(box.x + box.width / 2).toBeCloseTo(150);
    expect(box.y + box.height).toBeCloseTo(100 - gap);
  });

  it("lines its near edge up beside an upright line", () => {
    const box = placeLineLabel({
      run: [
        { x: 150, y: 180 },
        { x: 150, y: 20 },
      ],
      // The other line heads off to the left, so this label goes right.
      otherDirection: { x: -1, y: 0 },
      label,
      viewport,
      gap,
      inset,
    });

    expect(box.x).toBeCloseTo(150 + gap);
    expect(box.y + box.height / 2).toBeCloseTo(100);
  });

  it("stays out of the angle between the two lines", () => {
    const box = placeLineLabel({
      run: [
        { x: 50, y: 100 },
        { x: 250, y: 100 },
      ],
      // The other line heads up, so this label goes below.
      otherDirection: { x: 0, y: -1 },
      label,
      viewport,
      gap,
      inset,
    });

    expect(box.y).toBeCloseTo(100 + gap);
  });

  it("clears a slanted line with its nearest corner", () => {
    const box = placeLineLabel({
      run: [
        { x: 100, y: 150 },
        { x: 200, y: 50 },
      ],
      otherDirection: { x: -1, y: -1 },
      label,
      viewport,
      gap,
      inset,
    });

    // Below and to the right of the line, so the top left corner is the one
    // nearest it, and it is clear of the line.
    const corner = { x: box.x, y: box.y };
    const distanceFromLine = (corner.x + corner.y - 250) / Math.SQRT2;
    expect(distanceFromLine).toBeGreaterThan(0);
  });

  it("moves to the other side rather than leave the screen", () => {
    const box = placeLineLabel({
      run: [
        { x: 50, y: 5 },
        { x: 250, y: 5 },
      ],
      otherDirection: null,
      label,
      viewport,
      gap,
      inset,
    });

    expect(box.y).toBeCloseTo(5 + gap);
  });

  it("stays on screen when the line runs along the edge", () => {
    const box = placeLineLabel({
      run: [
        { x: 295, y: 20 },
        { x: 295, y: 180 },
      ],
      otherDirection: { x: -1, y: 0 },
      label,
      viewport,
      gap,
      inset,
    });

    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width - inset);
    expect(box.x).toBeGreaterThanOrEqual(inset);
  });

  it("keeps clear of a label already placed", () => {
    const first = placeLineLabel({
      run: [
        { x: 50, y: 100 },
        { x: 250, y: 100 },
      ],
      otherDirection: null,
      label,
      viewport,
      gap,
      inset,
    });
    const second = placeLineLabel({
      run: [
        { x: 50, y: 100 },
        { x: 250, y: 100 },
      ],
      otherDirection: null,
      label,
      viewport,
      gap,
      inset,
      avoid: [first],
    });

    const overlaps =
      second.x < first.x + first.width &&
      first.x < second.x + second.width &&
      second.y < first.y + first.height &&
      first.y < second.y + second.height;
    expect(overlaps).toBe(false);
  });
});
