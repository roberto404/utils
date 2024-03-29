//@ts-nocheck

/**
 * Object serializer
 * @param  {Object} data
 * @return {string}
 * @example
 * serialize({ foo: 'bar' });
 * // => 'foo=bar';
 */
const serialize = (data: {}): string =>
  Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');

export default serialize;
