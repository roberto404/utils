// @flow

/**
 * Array arrange select like shift click
 *
 * @since 4.14.0
 * @static
 * @memberof array
 * @param  {selection} array previously selected array indexes
 * @param {int} index "shift" selected element
 * @return  {array} array range
 * @example
 *
 * shiftSelect([2], 4)
 * // => [2, 3, 4]
 */
 const shiftSelect = (selection: Array<number>, index: number): Array<number> =>
 {
  const lastIndex = selection[selection.length - 1];

  const range = [];

  for (let i = lastIndex + 1; i <= index; i++)
  {
    range.push(i)
  }

  return [...selection.filter(i => range.indexOf(i) === -1), ...range];
 };

 export default shiftSelect;
 