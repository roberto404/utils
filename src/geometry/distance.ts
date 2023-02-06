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
const distance = (
  pointA: { x: number, y: number },
  pointB: { x: number, y: number },
): number =>
  Math.sqrt(
    ((pointB.x - pointA.x) * (pointB.x - pointA.x)) +
    ((pointB.y - pointA.y) * (pointB.y - pointA.y)),
  );

export default distance;
