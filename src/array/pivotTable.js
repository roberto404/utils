// @flow

import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import getCollectionProp from './getCollectionProp';


/**
* It returns grouped results
* @param  {string} prop    grouping result by this object key
* @param  {function} [labelIteratee = (records, field) => field]
* group field value format method. Default return original value
* @param  {function} [valueIteratee = (records, field) => records.length]
* group field items method. Default is count group elements
* @return {object}          {'group1': valueIteratee return, 'group2': valueIteratee return}
*
* @example
* Grouping by date, where the value sum every record person property
* [{date: '2016-02-03', person: '3'}...]
* // => {'2016-02-03': 22, '2016-02-04': 25 }
* collectionGroupBy(data, 'date', (value, key) => (sum(map(value, i => parseInt(i.person)))))
*/
export const collectionGroupBy = (
  data: Array<{}>,
  prop: string,
  labelIteratee?: (groupRecords: Array<{}>, groupProp: string) => string
    = (groupRecords, groupProp) => groupProp,
  valueIteratee?: (groupRecords: Array<{}>, groupProp: string) => number
    = groupRecords => groupRecords.length,
): Array<{ id: string, title: number }> =>
{
  return map(
    groupBy(data, x => x[prop]),
    (groupRecords, groupProp) =>
    ({
      id: labelIteratee(groupRecords, groupProp),
      title: valueIteratee(groupRecords, groupProp),
    }),
  );
};

/**
 * Collect collection and count data
 *
 * @since 3.9.0
 * @static
 * @memberof array
 * @param  {array} data collection
 * @param  {string} prop field of record within collection
 * @param  {func} method accumulator (ex. sum, mean, count ...)
 * @param  {string|array} group multidimension results
 * @return {object}
 * @example
 * pivotTable(data, 'gender', count),
 * // => 12
 *
 * pivotTable(data, 'gender', values => values.length),
 * // => 12
 *
 * pivotTable(data, 'gender', countUnique),
 * // => 2
 *
 * // collectionGroupBy(data, 'gender'),
 * // => [ { id: '1', title: 8 }, { id: '2', title: 4 } ]
 *
 * pivotTable(data, 'gender', count, 'gender'),
 * // => [ { id: '1', title: 8 }, { id: '2', title: 4 }, { id: 'count', title: 12 } ]
 *
 * pivotTable(data, 'age', mean, 'visits'),
 * // => { id: '2017-07-23', title: 22 }, { id: '2017-07-22', title: 28.666666666666668 } ...,
 *
 * pivotTable(data, 'age', mean, ['visits', 'gender']),
 * // => { id: '2017-07-23', title: [ { id: '1', title: 8 }, { id: '2', title: 4 }, { id: 'mean', title: 12 } ] }, ...
 *
 * pivotTable(data, mean),
 * // => { id: 6.5, name: NaN, gender: 1.3333333333333333, age: 26.5, visits: NaN }
 *
 */
const pivotTable2 = function (data: Array<{}>, prop?: string|Function, method?: Function, group?: string)
{
  if (typeof prop === 'undefined' || Array.isArray(data) === false)
  {
    return null;
  }

  let result;

  if (typeof prop === 'string' && typeof method === 'function')
  {
    let results = [];

    if (group)
    {
      const groups = Array.isArray(group) ? group : [group];
      let groupsIndex = 0;

      const groupDataIterator = (groupData) =>
      {
        groupsIndex += 1;

        const groupResult = method(getCollectionProp(groupData, prop));

        let child;

        if (groupsIndex < groups.length)
        {
          child = collectionGroupBy(groupData, groups[groupsIndex], undefined, groupDataIterator);
        }

        groupsIndex -= 1;

        if (child)
        {
          child.push({
            id: '_result',
            title: groupResult,
          });

          return child;
        }

        return groupResult;
      }

      /**
       * Collect data by group props. Iterate groups and call method every group
       * @type {array} [{ id: 'male', title: 2 }, { id: 'male', title: 2 }]
       * id: group field value,
       * title: calculated method results (ex. count, sum, mean ...)
       */
      results = collectionGroupBy(
        data,
        groups[0],
        undefined,
        groupDataIterator,
      );
    }

    /**
     * @example
     * // => [1,2,1,1,1,2,1]
     */
    const values = getCollectionProp(data, prop);

    results.push({
      id: method.name || 'result',
      title: values.length ? method(values) : 0,
    });

    result = (results.length === 1) ? results[0].title : results;
  }
  else if (typeof prop === 'function')
  {
    const method = prop;
    const columns = Object.keys(data[0]);

    result = columns.reduce(
      (results, column) => ({
        ...results,
        [column]: pivotTable(data, column, method),
      }),
      {},
    );
  }

  // if (this instanceof pivotTable)
  if (this)
  {
    this.result = result;
  }

  return result;
}

const pivotTable = function (data: Array<{}>, prop?: string|Function, method?: Function, group?: string|Array<string>)
{
  if (typeof prop === 'undefined' || Array.isArray(data) === false)
  {
    return null;
  }

  let result;

  if (typeof prop === 'string' && typeof method === 'function')
  {
    let results = [];

    if (group)
    {
      const groups = Array.isArray(group) ? group : [group];
      let groupsIndex = 0;

      const groupDataIterator = (groupData) =>
      {
        groupsIndex++;

        const groupResult = method(getCollectionProp(groupData, prop));

        let child;

        if (groupsIndex < groups.length)
        {
          child = collectionGroupBy(groupData, groups[groupsIndex], undefined, groupDataIterator);
        }

        groupsIndex--;

        if (child)
        {
          child.push({
            id: method.name || 'result',
            title: groupResult,
          });

          return child;
        }

        return groupResult;
      }

      /**
       * Collect data by group props. Iterate groups and call method every group
       * @type {array} [{ id: 'male', title: 2 }, { id: 'male', title: 2 }]
       * id: group field value,
       * title: calculated method results (ex. count, sum, mean ...)
       */
      results = collectionGroupBy(
        data,
        groups[0],
        undefined,
        groupDataIterator,
      );
    }

    /**
     * @example
     * // => [1,2,1,1,1,2,1]
     */
    const values = getCollectionProp(data, prop);

    results.push({
      id: method.name || 'result',
      title: values.length ? method(values) : 0,
    });

    result = (results.length === 1) ? results[0].title : results;
  }
  else if (typeof prop === 'function')
  {
    const method = prop;
    const columns = Object.keys(data[0]);

    result = columns.reduce(
      (results, column) => ({
        ...results,
        [column]: pivotTable(data, column, method),
      }),
      {},
    );
  }

  if (this instanceof pivotTable)
  {
    this.result = result;
    return;
  }

   return result;
}

pivotTable.prototype =
{
  /**
   * Convert pivotTable data to collection
   * @example
   * { id: '2017-07-23', title: [ { id: 'male', title: 8 }, { id: 'female', title: 4 }, { id: 'count', title: 12 } ] }
   * // => [{ id, male, femail, count }, ... ]
   */
  toArray: function(transform)
  {
    if (!this.result)
    {
      return [];
    }

    return this.result.map(({ id, title }) =>
    {
      const record = {id};

      if (Array.isArray(title))
      {
        title.forEach(child => record[child.id] = child.title);
      }
      else
      {
        record[id] = title;
      }

      return typeof transform === 'function' ? transform(record) : record;
    });
  },
};

export default pivotTable;
