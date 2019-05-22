// @flow

/**
 * Call function delay.
 * @since 3.7.0
 * @static
 * @memberof promise
 * @param  {Integer} seconds
 * @return {Promise}
 * @example
 * delay(1500).then(() => console.log('hi'));
 */
const delay = (seconds: number) :Promise<any> =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000));


export default delay;
