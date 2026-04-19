//@ts-nocheck

const ROMAN_VALUES = {
  M: 1000,
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  XC: 90,
  L: 50,
  XL: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1,
};

const NORMALIZED_ROMAN_REGEX = /^(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))$/;

/**
 * Convert decimal Number to Roman number
 * @param  {string|int} number decimal number
 * @return {string}        roman number
 * @example
 * decimalToRoman(14)
 * // => 'XIV'
 */
export const decimalToRoman = (number: number): string =>
{
  let roman = '';
  let descendingNumber = number;

  Object.keys(ROMAN_VALUES).forEach((romanNum) =>
  {
    const decimalNum = ROMAN_VALUES[romanNum];

    while (descendingNumber >= decimalNum)
    {
      roman += romanNum;
      descendingNumber -= decimalNum;
    }
  });

  return roman;
};

/**
 * Convert Roman number to decimal Number
 * @param  {string} roman Roman number
 * @return {number}       decimal number or NaN
 * @example
 * romanToDecimal('XIV.')
 * // => 14
 */
export const romanToDecimal = (roman: string): number =>
{
  if (typeof roman !== 'string')
  {
    return NaN;
  }

  const normalizedRoman = roman
    .trim()
    .replace(/\.+$/, '')
    .toUpperCase();

  if (!normalizedRoman || !NORMALIZED_ROMAN_REGEX.test(normalizedRoman))
  {
    return NaN;
  }

  let decimal = 0;
  let currentRoman = normalizedRoman;

  Object.keys(ROMAN_VALUES).forEach((romanNum) =>
  {
    const decimalNum = ROMAN_VALUES[romanNum];

    while (currentRoman.startsWith(romanNum))
    {
      decimal += decimalNum;
      currentRoman = currentRoman.substring(romanNum.length);
    }
  });

  return decimal;
};

export default decimalToRoman;
