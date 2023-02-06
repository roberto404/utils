/**
 * Similar like native [float].Fixed()
 * - able to use ceil or floor rounded methods
 * - Fixed() alway keep decimals, like 10.00
 *
 * @since 4.12.0
 * @static
 * @memberof math
 * @param  {float} value
 * @param  {int} num
 * @param  {function} [method=Math.round]
 * @return {float}
 * @example
 *
 * roundDecimal(10.234, 100)
 * // => 10.23
 *
 * roundDecimal(10, 1000)
 * // => 10
 */
export const roundDecimal = (value: number, num: number, method: Function = Math.round) => method(value * num) / num;
export const roundDecimalCeil = (value: number, num: number) => roundDecimal(value, num, Math.ceil);
export const roundDecimalFloor = (value: number, num: number) => roundDecimal(value, num, Math.floor);

/**
 * Interger number rounder
 *
 * @since 4.12.0
 * @static
 * @memberof math
 * @param  {float} value
 * @param  {int} num
 * @param  {function} [method=Math.round]
 * @return {float}
 * @example
 *
 * roundInteger(10234, 100)
 * // => 10000
 *
 * roundIntegerCeil(10234, 100)
 * // => 10300
 */
export const roundInteger = (value: number, num: number, method: Function = Math.round): number => method(value / num) * num;
export const roundIntegerCeil = (value: number, num: number) => roundInteger(value, num, Math.ceil);
export const roundIntegerFloor = (value: number, num: number) => roundInteger(value, num, Math.floor);
