// @flow

import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import checkPropTypes from '../propType/checkPropTypes';
import sort from '../array/sort';
import toNumber, { NOT_NAN_REGEX } from '../string/toNumber';
import clamp from '../math/clamp';
import pivotTable, { collectionGroupBy } from '../array/pivotTable';

import type { dataType, orderType, filterType, paginateType, sortMethodType } from './data.type';

const DIRECTIONS = ['asc', 'desc'];

export const PROPTYPE_FILTER = {
  id: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired,
  arguments: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ])),
  status: PropTypes.bool.isRequired,
};

export const PROPTYPES = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  paginate: PropTypes.shape({
    limit: PropTypes.number,
    page: PropTypes.number.isRequired,
  }),
  order: PropTypes.shape({
    column: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    direction: PropTypes.oneOf(DIRECTIONS),
  }),
  filters: PropTypes.arrayOf(PropTypes.shape(PROPTYPE_FILTER)),
};

export const PROPTYPE_SETTINGS = PropTypes.shape({
  paginate: PROPTYPES.paginate,
  order: PROPTYPES.order,
  filters: PROPTYPES.filters,
});

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
 *
 * new Data(data, settings);
 */
class Data
{
  _data: dataType;
  _results: dataType = [];
  _order: orderType;
  _filters: filterType[];
  _paginate: paginateType;
  sortMethod: sortMethodType;


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
      sortMethod?: sortMethodType,
    } = {},
  )
  {
    const errors = [
      ...(checkPropTypes(data, PROPTYPES.data, 'data') || []),
      ...(checkPropTypes(settings, PROPTYPE_SETTINGS, 'settings') || []),
    ];

    if (errors.length)
    {
      if (process.env.NODE_ENV !== 'production')
      {
        console.warn(`Data model inital error. ${errors.map(e => e.message).join(' ')}`); // eslint-disable-line no-console
      }
      return false;
    }

    this._data = data;

    this._results = this._data.concat([]);

    this._order = settings.order ||
      {
        column: '',
        direction: 'asc', // asc || desc
      };

    this._filters = settings.filters || [];

    this._paginate = settings.paginate ||
      {
        page: 1,
        limit: 20,
        totalPage: 0,
        results: null,
        nextPage: null,
        prevPage: null,
      };

    this.handle();
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

    const order = { ...this._order };

    if (['string', 'function'].indexOf(typeof settings.column) !== -1)
    {
      order.column = settings.column;
    }

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
   * // able to use object, if you set only one element
   *
   * data.filters = { id: 'foo', handler, arguments, status }
   *
   * // => data.results
   */
  get filters(): filterType[]
  {
    return this._filters;
  }

  set filters(newFilters: filterType[] | filterType)
  {
    // object to array
    const filters = (Array.isArray(newFilters)) ?
      newFilters.map(filter => ({ ...filter })) : [{ ...newFilters }];

    let modified = false;

    // register, update or inactive observed filter
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

    const paginate = {
      ...this._paginate,
      ...options,
    };

    if (typeof options.limit !== 'number')
    {
      paginate.limit = this._paginate.limit;
    }

    paginate.total = this._results.length;

    if (paginate.limit === 0)
    {
      paginate.limit = paginate.total;
    }

    paginate.totalPage = Math.ceil(paginate.total / paginate.limit);

    if (typeof options.page === 'number')
    {
      paginate.page = Math.ceil(options.page);
    }

    paginate.page = clamp(paginate.page, 1, paginate.totalPage);

    const offset = (paginate.page - 1) * paginate.limit;

    paginate.results = isNaN(offset) ? this._results :
      this._results.slice(offset, offset + paginate.limit);
    paginate.nextPage = (paginate.page < paginate.totalPage)
      ? paginate.page + 1 : null;
    paginate.prevPage = (paginate.page > 1)
      ? paginate.page - 1 : null;

    if (options.limit === 0)
    {
      paginate.limit = 0;
    }

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
  _sort = () =>
  {
    if (this.order.column)
    {
      if (typeof this.order.column === 'function')
      {
        this._results = sort(this._results, this.order.column);
        return;
      }

      // find not empty observed record
      this._results.some((record) =>
      {
        if (!record[this.order.column])
        {
          return false;
        }

        const field = record[this.order.column] || '';


        // number in string format
        if (!isNaN(field))
        {
          this._results = sort(this._results, (a, b) =>
          {
            /**
             * deviant situaction: First record seem like a number
             * @example
             * [{ title: '1' }, { title: 'abc' }...]
             */
            if (isNaN(a[this.order.column]) || isNaN(b[this.order.column]))
            {
              return String(a[this.order.column])
                .toLowerCase()
                .localeCompare(String(b[this.order.column]).toLowerCase()) === 1;
            }

            return parseFloat(a[this.order.column] || 0) >= parseFloat(b[this.order.column] || 0);
          });
        }
        // special numberic field (like currency)
        else if (typeof field === 'string' && NOT_NAN_REGEX.test(field))
        {
          this._results = sort(this._results, (left, right) =>
          {
            let a = left[this.order.column] || '';
            let b = right[this.order.column] || '';

            // string looks like a number => convert to number
            const aLikeNum = typeof a === 'string' && NOT_NAN_REGEX.test(a);
            const bLikeNum = typeof b === 'string' && NOT_NAN_REGEX.test(b);

            if (aLikeNum && (typeof b === 'number' || bLikeNum))
            {
              a = toNumber(a);
            }

            if (bLikeNum && typeof a === 'number')
            {
              b = toNumber(b);
            }

            return parseFloat(a || 0) >= parseFloat(b || 0);
          });
        }
        // string compare
        else
        {
          this._results = sort(this._results, (a, b) =>
            a[this.order.column]
              .toLowerCase()
              .localeCompare(b[this.order.column].toLowerCase()) === 1,
          );
        }

        return true;
      });
    }

    if (this.order.direction !== 'asc')
    {
      this._results.reverse();
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
    // all filter argument
    const args = {};
    this._filters.forEach(filter => args[filter.id] = filter.arguments); // eslint-disable-line

    this._results = this._results.filter(record =>
      this._filters.every(filter =>
        filter.status === false || filter.handler(record, ...filter.arguments, args, this),
      ),
    );
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
      filter,
      PROPTYPE_FILTER,
    );

    if (result)
    {
      return false;
    }

    this._filters = [...this._filters, filter];
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
    if (Object.keys(filter).some(key => this._filters[index][key] !== filter[key]))
    {
      this._filters[index] = {
        ...this._filters[index],
        ...filter,
      };
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

    this._paginate.page = 1;
    this._paginate = this._pagination(this._paginate);
  }

  getSettings()
  {
    return ({
      // filters: this._filters, // => todo _filter() paginationt 1-re allitja.
      order: this._order,
      paginate:
      {
        limit: this._paginate.limit,
        page: this._paginate.page,
      },
    });
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
   * [field description]
   * @type {string} field
   * @since 3.7.0
   */
  collectResultsByField(field: string | []): []
  {
    const respond = {};
    const fields = Array.isArray(field) ? field : [field];

    this.results.forEach((result) =>
    {
      const valueOfFields = fields.map(currentField => `#${result[currentField]}`);

      const pointer = valueOfFields.join('.');

      if (!has(respond, pointer))
      {
        set(respond, pointer, []);
      }

      set(respond, pointer, [...get(respond, pointer), result]);
    });

    return respond;
  }


  /**
  * It returns grouped results about the data filtered _results
  */
  getResultsGroupBy(
    field: string,
    labelIteratee?: (groupRecords: dataType, groupField: string) => string,
    valueIteratee?: (groupRecords: dataType, groupField: string) => number
  )
  {
    return collectionGroupBy(this.results, field, labelIteratee, valueIteratee);
  }

  /**
   * Calculate a PivotTable about the data filtered _results
   */
  getPivotTable(propColumn: string|Function, propMethod?: Function, group?: string)
  {
    return pivotTable(this.results, propColumn, propMethod, group);
  }

  /**
   * Determine Unique records.
   * Iterate all model result records and compare every record.
   * Grouping those records which deep equal, return grouped results array.
   * The UID field will be cast to array, which include all collected UID.
   *
   * @since 3.6.0
   * @param  {string} field basically UID.
   * @return {array}       arrayOf(Object), part of results
   * @example
   *   const data = [
   *     { id: 0, A: 1, B: 'foo' },
   *     { id: 1, A: 1, B: 'bar' },
   *     { id: 2, A: 1, B: 'bar' },
   *     { id: 3, A: 2, B: 'bar' },
   *     { id: 4, A: 1, B: 'foo' },
   *     { id: 5, A: 1, B: 'foo' },
   *   ];
   *   const dataModel = new Data(data);
   *
   *   dataModel.compact('id');
   *
   *   // => [
   *     { id: [0, 4, 5], A: 1, B: 'foo' },
   *     { id: [1, 2], A: 1, B: 'bar' },
   *     { id: [3], A: 2, B: 'bar' },
   *   ];
   */
  compact(field:string = 'id')
  {
    const compactResults = [];

    // iterate all model result records
    this.results.forEach((modelRecord) =>
    {
      const matched = compactResults.some((compactRecord, index) =>
      {
        const deepEqual = Object.keys(compactRecord).every((key) =>
        {
          if (key === field)
          {
            return true;
          }

          return modelRecord[key] === compactRecord[key];
        });

        if (deepEqual)
        {
          compactResults[index][field].push(modelRecord[field]);
        }

        return deepEqual;
      });

      if (!matched)
      {
        compactResults.push({
          ...modelRecord,
          [field]: [modelRecord[field]],
        });
      }
    });

    return compactResults;
  }
}

export default Data;
