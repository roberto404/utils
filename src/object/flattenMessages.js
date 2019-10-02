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


/**
 * Convert flattenMessages to nestetObject
 * @param  {object} messages
 * @return {Object}
 * @example
 * flattenMessages({ 'foo.bar': 2 });
 * // =>  { foo: { bar: 2 }}
 */
export const flattenMessagesRevert = messages =>
  Object.keys(messages).reduce(
    (result, key) =>
    {
      const keys = key.split('.');
      const depth = ['result'];

      keys.forEach((k) =>
      {
        depth.push(k);

        if (keys.length < depth.length)
        {
          let value = messages[key];

          if (typeof value === 'string')
          {
            value = `'${value}'`;
          }

          eval(`${depth.join('.')} = ${value}`)
        }
        else if (!eval(depth.join('.')))
        {
          eval(`${depth.join('.')} = {}`);
        }
      });

      return result;
    },
    {},
  );

export default flattenMessages;
