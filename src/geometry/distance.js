/**
 * Calculate distance two coordinate points
 *
 * @since 1.2.0
 * @static
 * @memberof geometry
 * @param  {object} a   coordinate point
 * @param  {object} b   coordinate point
 * @return {int}
 * @example
 *
 * distance({ x: 1, y: 1 }, { x: 2, y: 2 });
 * // => 1.4142135623730951
 */
const distance = (a, b) =>
  Math.sqrt(
    ((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)),
  );

export default distance;
