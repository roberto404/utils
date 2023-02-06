/**
 * Thousand Separator / string format
 *
 * @since 3.13.0
 * @static
 * @memberof string
 * @param {string|number} number
 * @param {string} [separator] default space
 * @return {string}
 * @example
 *
 * formatThousand(1000000.25)
 * // => 1 000 000.25
 */
const formatThousand = (number: number|string, separator: string = ' '): string =>
{
  const numberString = String(number);
  const fractionIndex = numberString.indexOf('.');

  return numberString.replace(
    /\d(?=(?:\d{3})+(?:\.|$))/g,
    (m, i) => fractionIndex < 0 || i < fractionIndex ? `${m}${separator}` : m, // eslint-disable-line
  );
};


export default formatThousand;
