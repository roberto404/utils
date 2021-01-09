// @flow

/**
 * Simplify large number to readable for human
 *
 * @since 3.11.0
 * @static
 * @memberof math
 * @param  {int} value observed value
 * @param  {int} root   root value (bytes mean 1024)
 * @param  {array} units   ['B', 'KB', 'GB', 'MB']
 * @param  {function} [format]  ({ value, unit }) => value + unit
 * @return {string}
 * @example
 *
 * simplify(1024 * 4, 1024, ['B', 'KB', 'GB', 'MB'])
 * // => 4KB
 *
 * simplify(9999, 1000, ['', 'E','M','Mrd'])
 * // => 10E
 *
 * simplify(999, 1000, ['E','M','Mrd']);
 * // => 999
 */
const simplify = (
  value: number,
  root: number,
  units: Array<string>,
  format?: Function = ({ value, unit }) => (Math.round(value * 10) / 10) + unit
): string|number =>
{
  const nth = units.findIndex((unit, index) => Math.abs(value) / Math.pow(root, index) < root)

  return format({
    value: (Math.abs(value) / Math.pow(root, nth)) * (value < 0 ? -1 : 1),
    unit: units[nth],
  });
}

export default simplify;
