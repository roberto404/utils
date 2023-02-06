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

export default decimalToRoman;
