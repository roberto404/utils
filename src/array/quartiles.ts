/**
 * Function returns the quartiles (Q1, Q2, Q3) of an array of numbers.
 *
 * Quartiles divide the sorted data into four equal parts:
 * - Q1: 25th percentile
 * - Q2: 50th percentile (median)
 * - Q3: 75th percentile
 *
 * @since 5.4.0
 * @static
 * @memberof array
 * @param  {Array<number>} array The array to inspect.
 * @return {{ Q1: number, Q2: number, Q3: number } | null} Quartiles or null if empty.
 * @example
 *
 * quartiles([1,2,3,4,5,6,7,8]);
 * // => { Q1: 2.25, Q2: 4.5, Q3: 6.75 }
 */
const quartiles = (array: Array<number>): { Q1: number; Q2: number; Q3: number } | null => {
  if (!array.length) return null;

  const sorted = [...array].sort((a, b) => a - b);

  const percentile = (p: number): number => {
    const pos = (sorted.length - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    return sorted[base + 1] !== undefined
      ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
      : sorted[base];
  };

  return {
    Q1: percentile(0.25),
    Q2: percentile(0.5),
    Q3: percentile(0.75)
  };
};

export default quartiles;
