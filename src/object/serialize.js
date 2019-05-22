
/**
 * Object serializer
 * @param  {Object} data
 * @return {string}
 * @example
 * serialize({ foo: 'bar' });
 * // => 'foo=bar';
 */
const serialize = data =>
  Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');

export default serialize;
