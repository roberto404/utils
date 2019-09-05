// @flow

/**
 * Gets the property values from all elements in collection. (like Lodash pluck)
 *
 * @since 3.9.0
 * @static
 * @memberof array
 * @param  {array} data  collection
 * @param  {string} prop property of collection
 * @return {array}
 * @example
 * const data = [{ id: 1, name: 'John'}, { id: 2, name: 'Doe'} ];
 * getCollectionProp(data, 'name')
 *
 * // => ['John', 'Doe'];
 *
 * @example
 * [{ id: 1, floor: "1" }, { id: 2, floor: 2 }, { id: 3 }]
 *
 * // => [1, 2]
 */
const getCollectionProp = (data: Array<{}>, prop: string) =>
  data.reduce(
    (result, record) =>
    {
      const value = record[prop];

      if (typeof value !== 'undefined')
      {
        result.push(
          isNaN(value) ? value : parseFloat(value),
        );
      }

      return result;
    },
    [],
  );

export default getCollectionProp;
