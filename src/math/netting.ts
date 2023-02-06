/**
 * Netting
 *
 * @since x.xx.xx
 * @static
 * @memberof math
 * @param  {int} gross
 * @param  {int} vat
 * @return {int}       net
 * @example
 *
 * netting(127, 27);
 * // => 100
 */
const netting = (gross: number, vat: number): number =>
  gross / ((vat + 100) / 100);

export default netting;
