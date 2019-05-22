/**
 * Convert nestetObject to one dimension object
 * @param  {object} nestedMessages
 * @param  {String} [prefix='']
 * @return {Object}
 * @example
 * flattenMessages({ foo: { bar: 2 }});
 * // =>  { 'foo.bar': 2 }
 */
const flattenMessages = (nestedMessages, prefix = '') =>
  Object
    .keys(nestedMessages)
    .reduce((messages, key) =>
    {
      const value = nestedMessages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      switch (typeof value)
      {
        case 'string':
        case 'number':
        case 'boolean':
          return {
            ...messages,
            [prefixedKey]: value,
          };

        case 'object':
          return {
            ...messages,
            ...flattenMessages(value, prefixedKey),
          };

        default:
          return messages;
      }
    }, {});


export default flattenMessages;
