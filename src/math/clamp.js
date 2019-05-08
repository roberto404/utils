// @flow

/**
 * Clamping is the process of limiting a position to an area.
 * Interval two value (min -> {x} <- max)
 *
 * @since 1.0.0
 * @static
 * @memberof math
 * @param  {int} value inspected value
 * @param  {int} min   value must be minimum
 * @param  {int} max   value can not be more than the maximum
 * @return {int}       value among min and max
 * @example
 *
 * clamp(10, 15, 20);
 * // => 15
 */
const clamp = (
  value: number,
  min: number | false,
  max?: number,
): number =>
{
  const maxValue = (typeof max === 'number') ? max : value;
  const minValue = (typeof min === 'number') ? min : maxValue;

  return Math.max(Math.min(maxValue, value), minValue);
};

export default clamp;
