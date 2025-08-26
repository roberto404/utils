/**
 * Function detects the general data type of the elements in an array.
 *
 * Possible return values:
 * - "numeric": all elements are numbers
 * - "date": all elements are dates or parseable date strings
 * - "categorical": all elements are strings or booleans
 * - "mixed": elements are of different types
 * - "empty": the array is empty
 *
 * @since 5.4.0
 * @static
 * @memberof array
 * @param  {Array<any>} array The array to inspect.
 * @return {"numeric" | "date" | "categorical" | "mixed" | "empty"} Detected type of the array elements.
 * @example
 *
 * detectArrayType([1, 2, 3]);
 * // => "numeric"
 *
 * detectArrayType(['2023-01-01', '2024-02-02']);
 * // => "date"
 *
 * detectArrayType(['apple', 'banana']);
 * // => "categorical"
 *
 * detectArrayType([1, 'apple']);
 * // => "mixed"
 *
 * detectArrayType([]);
 * // => "empty"
 */
const detectArrayType = (
  array: any[]
): 'numeric' | 'date' | 'categorical' | 'mixed' | 'empty' => {
  if (!array.length) return 'empty';

  let numeric = 0, date = 0, categorical = 0;

  for (const item of array) {
    if (typeof item === 'number' && !isNaN(item)) {
      numeric++;
    } else if (
      item instanceof Date ||
      (typeof item === 'string' && !isNaN(Date.parse(item)))
    ) {
      date++;
    } else {
      categorical++;
    }
  }

  if (numeric === array.length) return 'numeric';
  if (date === array.length) return 'date';
  if (categorical === array.length) return 'categorical';
  
  return 'mixed';
};

export default detectArrayType;
