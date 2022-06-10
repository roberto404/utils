import forEach from 'lodash/forEach';


export const stringify = (value) =>
{
  switch (typeof value)
  {
    case 'string':
      return value;

    case 'object':
      return !value ? '' : JSON.stringify(value);

    case 'boolean':
      return (+value).toString();

    default:
      return (value !== undefined && typeof value.toString !== 'undefined') ? value.toString() : '';
  }
};

/**
 * Convert object items to string
 * @param  {Object} payload { id: 1, flag: [1, 2] }
 * @return {Object}         { id: "1", flag: "[1,2]" }
 */
export const objectStringify = (payload) =>
{
  const results = {};

  forEach(payload, (value, index) =>
  {
    results[index] = stringify(value);
  });

  return results;
}

export default objectStringify;
