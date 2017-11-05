// @flow

/**
 * Convert degree to radian
 *
 * @since 1.0.0
 * @static
 * @memberof geometry
 * @param  {int} deg   degree
 * @return {int}       radian
 * @example
 *
 * deg2rad(180);
 * // => Math.PI
 */
const deg2rad = (deg: number): number => deg * (Math.PI / 180);

export default deg2rad;
