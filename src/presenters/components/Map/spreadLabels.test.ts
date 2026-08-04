import { spreadLabels } from "./spreadLabels";

const sameSize = (size: number) => (centers: number[]) =>
  centers.map((center) => ({ center, size }));

const label16 = sameSize(16);

describe("spreadLabels", () => {
  it("leaves labels alone when they already clear each other", () => {
    expect(spreadLabels(label16([0, 30, 60]), 3)).toEqual([0, 30, 60]);
  });

  it("separates labels that sit on top of each other", () => {
    const centers = spreadLabels(label16([100, 104, 108]), 3);

    expect(centers[1] - centers[0]).toBeCloseTo(19);
    expect(centers[2] - centers[1]).toBeCloseTo(19);
  });

  it("keeps the group centred on where the labels wanted to be", () => {
    const centers = spreadLabels(label16([100, 104, 108]), 3);

    expect(centers.reduce((a, b) => a + b, 0) / 3).toBeCloseTo(104);
  });

  it("preserves the order the labels came in", () => {
    const centers = spreadLabels(label16([108, 100, 104]), 3);

    expect(centers[0]).toBeGreaterThan(centers[2]);
    expect(centers[2]).toBeGreaterThan(centers[1]);
  });

  it("only moves the labels that are crowded", () => {
    const centers = spreadLabels(label16([0, 100, 102, 400]), 3);

    expect(centers[0]).toBe(0);
    expect(centers[3]).toBe(400);
    expect(centers[1]).toBeCloseTo(91.5);
    expect(centers[2]).toBeCloseTo(110.5);
  });

  it("honours differing label sizes", () => {
    const centers = spreadLabels(
      [
        { center: 50, size: 10 },
        { center: 52, size: 30 },
      ],
      2
    );

    expect(centers[1] - centers[0]).toBeCloseTo(22);
  });

  it("handles a single label and no labels", () => {
    expect(spreadLabels(label16([42]), 3)).toEqual([42]);
    expect(spreadLabels([], 3)).toEqual([]);
  });
});
