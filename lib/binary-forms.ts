export type BinaryPoint = { x: number; y: number };
export type BinaryForm = { points: BinaryPoint[]; aspect: number };

export const MORPH_CYCLE = 27;
export const MORPH_START = 5.5;
export const MORPH_END = 24;

function settle(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** Continuous position and velocity at every hold and at the cycle boundary. */
export function sampleBinaryMorph(time: number) {
  const phase = ((time % MORPH_CYCLE) + MORPH_CYCLE) % MORPH_CYCLE;
  return {
    amount:
      settle((phase - MORPH_START) / 2.5) * (1 - settle((phase - 21) / 2.6)),
  };
}

/** Rasterize once, then distribute the same particles evenly across the ink. */
export function makeBinaryForm(label: string, order: number[]): BinaryForm {
  const mask = document.createElement('canvas');
  mask.width = 1100;
  mask.height = 240;
  const context = mask.getContext('2d', { willReadFrequently: true });
  if (!context) return { points: order.map(() => ({ x: 0, y: 0 })), aspect: 6 };
  context.font = '700 160px Manrope, Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#fff';
  context.fillText(label, mask.width / 2, mask.height / 2);
  const pixels = context.getImageData(0, 0, mask.width, mask.height).data;
  const candidates: BinaryPoint[] = [];
  let left = mask.width;
  let right = 0;
  let top = mask.height;
  let bottom = 0;
  for (let y = 0; y < mask.height; y += 3) {
    for (let x = 0; x < mask.width; x += 3) {
      if (pixels[(y * mask.width + x) * 4 + 3] < 180) continue;
      candidates.push({ x, y });
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }
  const inkWidth = Math.max(1, right - left);
  const inkHeight = Math.max(1, bottom - top);
  const selected = order.map((_, index) => {
    const point =
      candidates[
        Math.floor(((index + 0.5) / order.length) * candidates.length)
      ];
    return {
      x: ((point?.x ?? left) - left) / inkWidth - 0.5,
      y: ((point?.y ?? top) - top) / inkHeight - 0.5,
    };
  });
  // Angular correspondence keeps the journey coherent as the orbit unfolds.
  selected.sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x));
  const points: BinaryPoint[] = new Array(order.length);
  order.forEach((particleIndex, rank) => {
    points[particleIndex] = selected[rank];
  });
  return { points, aspect: inkWidth / inkHeight };
}
