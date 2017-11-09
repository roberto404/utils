// @flow

import PropTypes from 'prop-types';
import checkPropTypes from 'check-prop-types';
import forIn from 'lodash/forIn';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';

import type { dataType, orderType, filterType, paginateType } from './data.type';

const DIRECTIONS = ['asc', 'desc'];
const FILTER_SCHEMA = {
  id: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired,
  arguments: PropTypes.arrayOf(PropTypes.string),
  status: PropTypes.bool.isRequired,
};


/**
 * Helper to Data grid
 * Object transforms: paginate, sort, filters
 *
 * @since 1.0.0
 * @class
 * @param  {Object} data     full data Object
 * @param  {Object} [settings]
 * @example
 * // data
 * [
 *   { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
 *   { id: 2, name: 'Taylor R. Fallin', gender: 2, visits: '2017-07-22' },
 *   { id: 3, name: 'Jose C. Rosado', gender: 1, visits: '2017-07-20' },
 *   { id: 4, name: 'Sammy C. Brandt', gender: 1, visits: '2017-07-10' },
 * ];
 *
 * // settings
 *
 * {
 *   paginate:
 *   {
 *     limit: 2,
 *   },
 *   order:
 *   {
 *     column: 'name',
 *     direction: 'desc',
 *   },
 *   filters:
 *   [
 *     {
 *       id: 'search',
 *       handler: (record, value) =>
 *         record.name
 *           .toString()
 *           .toLowerCase()
 *           .indexOf(value.toString().toLowerCase()) >= 0,
 *       arguments: [],
 *       status: false,
 *     },
 *   ],
 * };
 */
class Data
{
  _data: dataType;
  _results: dataType = [];
  _order: orderType;
  _filters: filterType[];
  _paginate: paginateType;


  /**
   * @constructs
   * @private
   * @param  {Object} data     full data Object
   * @param  {Object} [settings]
   */
  constructor(
    data: dataType,
    settings?: {
      order?: orderType,
      filters?: Array<filterType>,
      paginate?: paginateType,
    } = {},
  )
  {
    if (data === undefined || typeof settings !== typeof {})
    {
      return false;
    }

    this._data = data;

    this._results = this._data.concat([]);

    this._order =
    {
      column: '',
      direction: 'asc', // asc || desc
    };

    this._filters = [];

    this._paginate =
    {
      page: 1,
      limit: 20,
      totalPage: 0,
      results: null,
      nextPage: null,
      prevPage: null,
    };

    this.order = settings.order || {};
    this.filters = settings.filters || [];
    this.paginate = settings.paginate || { page: 1 };
  }

  /* !- Getter Setter */

  /**
   * Raw data.
   * @type {array}
   */
  get data(): dataType
  {
    return this._data;
  }

  set data(data: dataType)
  {
    this._data = data;
    this.handle();
  }

  /**
   * Handled data results.
   * @type {array}
   */
  get results(): dataType
  {
    return this._results;
  }

  set results(results: dataType)
  {
    this._results = results;
  }

  /**
   * Current order settings
   * @type {object}
   * @example
   *
   * const data = new Data(json);
   *
   * data.order = {column: 'name', direction: 'asc'};
   * // => data.results
   */
  get order(): orderType
  {
    return this._order;
  }

  set order(settings: orderType)
  {
    if (isEmpty(settings))
    {
      return;
    }

    const order = Object.assign({}, this._order);

    if (!settings.direction && settings.column === order.column)
    {
      order.direction = DIRECTIONS[+!DIRECTIONS.indexOf(order.direction)];
    }
    else if (
      settings.direction !== this.order.direction
      && DIRECTIONS.indexOf(settings.direction) !== -1
    )
    {
      order.direction = settings.direction;
    }

    if (!order.direction)
    {
      order.direction = DIRECTIONS[0];
    }

    if (settings.column !== order.column &&
        Object.keys(this.data[0]).indexOf(settings.column) !== -1)
    {
      order.column = settings.column;
    }

    if (!isEqual(order, this.order))
    {
      this._order = order;
      this.handle();
    }
  }

  /**
   * Filter Collections
   * @type {array}
   * @example
   *
   * const data = new Data(json);
   *
   * data.filters = [
   * {
   *    id: 'foo',
   *    handler: (record, foo, bar) => record.foo == foo,
   *    arguments: ['foo', 'bar'],
   *    status: true,
   * }];
   *
   * // => data.results
   */
  get filters(): filterType[]
  {
    return this._filters;
  }

  set filters(newFilters: filterType[] | filterType)
  {
    const filters = (Array.isArray(newFilters)) ?
      newFilters : [newFilters];

    let modified = false;

    filters.forEach((filter) =>
    {
      const filterIndex = this.filters.findIndex(f => f.id === filter.id);

      if (filterIndex === -1)
      {
        modified = this._registerNewFilter(filter);
      }
      else if (!filter.arguments || isEmpty(filter.arguments))
      {
        if (this._inactiveFilterByIndex(filterIndex))
        {
          modified = true;
        }
      }
      else if (this._updateFilterByIndex(filterIndex, filter))
      {
        modified = true;
      }
    });

    if (modified)
    {
      this.handle();
    }
  }

  /**
   * Current order settings
   * @type {object}
   * @example
   *
   * const data = new Data(json);
   *
   * data.paginate = {
   *    page: 3,
   *    limit: 1
   * };
   *
   * // => data.paginate.results
   */
  get paginate(): paginateType
  {
    return this._paginate;
  }

  set paginate(options: paginateType)
  {
    if (!isEmpty(options))
    {
      this._paginate = this._pagination(options);
    }
  }

  /* !- Private methods */

  /**
   * Pagination
   *
   * @private
   * @return {void}
   */
  _pagination(options: paginateType): paginateType
  {
    if (typeof options !== 'object')
    {
      return this._paginate;
    }

    const paginate = Object.assign({}, this._paginate, options);

    if (typeof options.limit === 'number')
    {
      paginate.limit = options.limit;
    }

    paginate.total = this._results.length;
    paginate.totalPage = Math.ceil(paginate.total / paginate.limit);

    if (typeof options.page === 'number' &&
        options.page > 0 &&
        options.page <= paginate.totalPage)
    {
      paginate.page = Math.ceil(options.page);
    }
    else
    {
      paginate.page = this._paginate.page;
    }

    const offset = (paginate.page - 1) * paginate.limit;

    paginate.results = this._results.slice(offset, offset + paginate.limit);
    paginate.nextPage = (paginate.page < paginate.totalPage)
      ? paginate.page + 1 : null;
    paginate.prevPage = (paginate.page > 1)
      ? paginate.page - 1 : null;

    return paginate;
  }

  /**
   * Sorting _results object by key (alias column) and directions
   * this.order = {column: 'name', direction: 'desc'}
   *
   * if this.order.column is null method not apply.
   *
   * @private
   * @return {void}
   */
  _sort()
  {
    if (this.order.column)
    {
      this._results.sort((recordOne, recordTwo) =>
      {
        if (typeof this.order.column === 'undefined')
        {
          return 1;
        }
        const a = recordOne[this.order.column];
        const b = recordTwo[this.order.column];

        if (!isNaN(a))
        {
          return (parseInt(a) < parseInt(b)) ? -1 : 1;
        }

        return a.toLowerCase().localeCompare(b.toLowerCase());
      });

      if (this.order.direction !== 'asc')
      {
        this._results.reverse();
      }
    }
  }

  /**
   * Apply registered filters
   *
   * @private
   * @return {void}
   */
  _filter()
  {
    this._results = this._results.filter((record) =>
    {
      let proper = true;

      this._filters
        .map((filter) =>
        {
          if (proper && filter.status && !filter.handler(record, ...filter.arguments))
          {
            proper = false;
          }

          return true;
        });

      return proper;
    });
  }


  /**
   * Push new filter object to _filters
   * if it is corresponds to scheme
   *
   * @private
   * @param  {object} filter
   * @return {boolean} successfull of registration
   */
  _registerNewFilter(filter: filterType): boolean
  {
    const result = checkPropTypes(
      FILTER_SCHEMA,
      filter,
      'filter',
      'Data',
    );

    if (result)
    {
      return false;
    }

    this._filters.push(filter);
    return true;
  }

  /**
   * Inactivate filter by index of _filters
   *
   * @private
   * @param  {int} index
   * @return {bool} true
   */
  _inactiveFilterByIndex(index: number): boolean
  {
    if (!this._filters[index])
    {
      return false;
    }

    this._filters[index].status = false;
    return true;
  }

  /**
   * Update current filter property
   *
   * @private
   * @param  {int} index
   * @param  {object} filter new filter properties
   * @return {boolean} successfull of update process
   */
  _updateFilterByIndex(index: number, filter: filterType): boolean
  {
    let modified = false;
    const newFilter = this._filters[index];

    forIn(newFilter, (value, key) =>
    {
      if (typeof filter[key] === typeof value)
      {
        newFilter[key] = filter[key];
        modified = true;
      }
    });

    if (modified)
    {
      this._filters[index] = newFilter;
      return true;
    }

    return false;
  }


  /**
   * Remove current filter (oposite registerFilter)
   *
   * @private
   * @param  {int} index
   * @return {boolean}
   * @todo not used yet
   */
  // _terminateFilterByIndex(index)
  // {
  //   return true;
  // }


  /* !- Public methods */

  /**
  * Data handling process -> this.results
  * - apply filters
  * - sort results
  *
  * @return {void}
  */
  handle(): void
  {
    this._results = this._data.concat([]);

    if (!isEmpty(this.filters))
    {
      this._filter();
    }

    this._sort();

    this._paginate = this._pagination(this._paginate);
  }


  /**
   * Return data element by index
   * @param  {int} index
   * @return {object}
   */
  getDataByIndex(index: number): {} | boolean
  {
    if (typeof this._data[index] === 'undefined')
    {
      return false;
    }

    return this.data[index];
  }


  /**
   * Return results element by index
   * @param  {int} index
   * @return {object}
   */
  getResultByIndex(index: number): {} | boolean
  {
    if (typeof this.results[index] === 'undefined')
    {
      return false;
    }

    return this.results[index];
  }


  /**
  * It returns grouped results
  * @param  {string} field    grouping result by this object key
  * @param  {function} [valueIteratee = (records, field) => records.length]
  * group field items method. Default is count group elements
  *
  * @param  {function} [labelIteratee = (records, field) => field]
  * group field value format method. Default return original value
  *
  * @example
  * <caption>Grouping by date, where the value sum every record person property
  * [{date: '2016-02-03', person: '3'}...]</caption>
  * // return {'2016-02-03': 22, '2016-02-04': 25 }
  * groupByResults('date', (value, key) => (_.sum(_.map(value, i => parseInt(i.person)))))
  *
  * // grouping by category where the value max id each group
  *
  * dataModel.getResultsGroupBy(
  *   'category',
  *   undefined,
  *   records => Math.max(...records.map(record => record['id'])),
  * )
  *
  *
  * @return {object}          {'group1': ineratee return, 'group2': valueIteratee return}
  */
  getResultsGroupBy(
    field: string,
    labelIteratee?: (groupRecords: dataType, groupField: string) => string
      = (groupRecords, groupField) => groupField,
    valueIteratee?: (groupRecords: dataType, groupField: string) => number
      = groupRecords => groupRecords.length,
  ): Array<{ id: string, title: number }>
  {
    return map(
      groupBy(this.results, x => x[field]),
      (groupRecords, groupField) =>
      ({
        id: labelIteratee(groupRecords, groupField),
        title: valueIteratee(groupRecords, groupField),
      }),
    );
  }

  /**
   * Calculate a PivotTable about the data filtered _results
   * @param  {string} column Observed record field
   * @param  {function} method this method get an array results -> column value
   * @param  {string} [group]  other column which unique values showes each observed field value
   * @return {number|object}
   * @example
   * dataModel.getPivotTable('category', count)
   * // -> 7
   *
   * dataModel.getPivotTable('id', max, 'category')
   * // ->[
   *  { id: 'A', title: 4 },
   *  { id: 'B', title: 5 },
   *  { id: 'undefined', title: 7 },
   *  { id: 'max', title: 7 },
   * ]
   */
  getPivotTable(column: string, method: Function, group?: string)
  {
    let result = [];
    const data = this.results.map(record => record[column]);

    if (group)
    {
      result = this.getResultsGroupBy(
        group,
        undefined,
        records => method(records.map(record => record[column])),
      );
    }

    result.push({
      id: method.name,
      title: method(data),
    });

    return (result.length === 1) ? result[0].title : result;
  }
}

export default Data;
