export type LabelExtent = {
  /** Where the label would sit if nothing else were in the way. */
  center: number;
  /** How much room the label needs along the axis. */
  size: number;
};

type Block = { sum: number; count: number };

/**
 * Nudges labels along one axis until none of them overlap, moving them as
 * little as possible. Front, centre and back of green sit within a few metres
 * of each other, so on a tilted map their labels land on top of one another;
 * this pushes them apart while keeping each one as close as it can be to the
 * point it belongs to.
 */
export function spreadLabels(labels: LabelExtent[], gap: number): number[] {
  if (labels.length === 0) return [];

  const order = labels
    .map((_, index) => index)
    .sort((a, b) => labels[a].center - labels[b].center);

  // Once each label is shifted back by the minimum room its predecessors need,
  // "nobody overlaps" is the same statement as "these values never decrease".
  const offsets = [0];
  for (let i = 1; i < order.length; i++) {
    const prev = labels[order[i - 1]];
    const curr = labels[order[i]];
    offsets[i] = offsets[i - 1] + prev.size / 2 + curr.size / 2 + gap;
  }
  const desired = order.map((index, i) => labels[index].center - offsets[i]);

  // Pool adjacent violators: the nearest non-decreasing sequence, which is also
  // the arrangement that moves the labels the least in total.
  const blocks: Block[] = [];
  desired.forEach((value) => {
    let block: Block = { sum: value, count: 1 };
    while (blocks.length > 0) {
      const prev = blocks[blocks.length - 1];
      if (prev.sum / prev.count <= block.sum / block.count) break;
      blocks.pop();
      block = { sum: prev.sum + block.sum, count: prev.count + block.count };
    }
    blocks.push(block);
  });

  const resolved = blocks.flatMap((block) =>
    new Array(block.count).fill(block.sum / block.count)
  );

  const centers: number[] = [];
  order.forEach((index, i) => {
    centers[index] = resolved[i] + offsets[i];
  });
  return centers;
}
