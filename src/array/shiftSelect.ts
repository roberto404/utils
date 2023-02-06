/**
 * Array arrange select
 * like shift click extends array from lastindex to selected index
 *
 * @since 4.14.0
 * @static
 * @memberof array
 * @param  {array} selection previously selected array indexes
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

  const range: Array<number> = [];

  for (let i = lastIndex + 1; i <= index; i++)
  {
    range.push(i)
  }

  return [...selection.filter(i => range.indexOf(i) === -1), ...range];
 };

 export default shiftSelect;
 