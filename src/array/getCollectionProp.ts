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
const getCollectionProp = <T>(data: Array<{[key: string]: T}>, prop: string): Array<T> =>
  data
    .map(record => record[prop])
    .filter(value => value);

export default getCollectionProp;
