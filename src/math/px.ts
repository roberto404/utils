/**
 * Convert rem to pixels
 *
 * @since 4.7.0
 * @static
 * @memberof math
 * @param  {int} rem value in rem
 * @return {int}       value in pixels
 * @example
 *
 * remToPix(3);
 * // => 30
 */
export const remToPix = (rem: number): number => {

  if (typeof getComputedStyle === 'undefined' || typeof document === 'undefined')
  {
    return 0;
  }

  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// const emToPix = parentElement =>
//   parseFloat(getComputedStyle(parentElement).fontSize);


export default {
  remToPix,
};
