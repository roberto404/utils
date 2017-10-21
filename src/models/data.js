import forIn from 'lodash/forIn';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';

const DIRECTIONS = ['asc', 'desc'];
const FILTER_SCHEME =
  {
    id: 'string',
    handler: 'function',
    arguments: 'object',
    status: 'boolean',
  };

/**
 * Helper to Data grid
 * Object transforms: paginate, sort, filters
 *
 * @since 1.0.0
 * @class
 */
class Data
{
  /**
   * @constructs
   * @param  {Object} data     full data Object
   * @param  {Object} [settings]
   * @example
   // data

   [
     { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
     { id: 2, name: 'Taylor R. Fallin', gender: 2, visits: '2017-07-22' },
     { id: 3, name: 'Jose C. Rosado', gender: 1, visits: '2017-07-20' },
     { id: 4, name: 'Sammy C. Brandt', gender: 1, visits: '2017-07-10' },
   ];

   // settings

   {
     paginate:
     {
       limit: 2,
     },
     order:
     {
       column: 'name',
       direction: 'desc',
     },
     filters:
     [
       {
         id: 'search',
         handler: (record, value) =>
           record.name
             .toString()
             .toLowerCase()
             .indexOf(value.toString().toLowerCase()) >= 0,
         arguments: [],
         status: false,
       },
     ],
   };
   */
  constructor(data, settings = {})
  {
    if (data === undefined || typeof settings !== typeof {})
    {
      return false;
    }

    this._data = data;

    this._results = this._data.concat([]);

    this._order =
    {
      column: null,
      direction: 'asc', // asc || desc
    };

    this._filters = [];

    this._paginate =
    {
      page: 1,
      limit: 20,
      totalPage: null,
      results: null,
      nextPage: null,
      prevPage: null,
    };

    this.order = settings.order || {};
    this.filters = settings.filters || {};
    this.paginate = settings.paginate || {};
  }

  /* !- Getter Setter */

  /**
   * Raw data.
   * @type {array}
   */
  get data()
  {
    return this._data;
  }

  set data(data)
  {
    this._data = data;
    this.handle();
  }

  /**
   * Handled data results.
   * @type {array}
   */
  get results()
  {
    return this._results;
  }

  set results(results)
  {
    this._results = results;
  }

  /**
   * Current order settings
   * @type {object}
   * @example
   *
   * {column: 'name', direction: 'asc'}
   */
  get order()
  {
    return this._order;
  }

  set order(settings)
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
  get filters()
  {
    return this._filters;
  }

  set filters(newFilters)
  {
    let filters = [];
    let modified = false;

    if (newFilters.length === undefined)
    {
      filters = [newFilters];
    }
    else
    {
      filters = newFilters;
    }

    filters.forEach((filter) =>
    {
      const filterIndex = this.filters.findIndex(f => f.id === filter.id);

      if (filterIndex === -1)
      {
        if (this._registerNewFilter(filter))
        {
          modified = true;
        }
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
  get paginate()
  {
    return this._paginate;
  }

  set paginate(options = {})
  {
    this._paginate = this._pagination(options);
  }

  /* !- Private methods */

  /**
   * Pagination
   *
   * @private
   * @return {void}
   */
  _pagination(options)
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
      ? paginate.page + 1 : false;
    paginate.prevPage = (paginate.page > 1)
      ? paginate.page - 1 : false;

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
    if (this.order.column !== null)
    {
      this._results.sort((recordOne, recordTwo) =>
      {
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
  _registerNewFilter(filter)
  {
    const newFilter = {};

    forIn(FILTER_SCHEME, (value, key) =>
    {
      if (typeof filter[key] === value)
      {
        newFilter[key] = filter[key];
      }
    });

    if (!isEmpty(newFilter))
    {
      this._filters.push(newFilter);
      return true;
    }

    return false;
  }

  /**
   * Inactivate filter by index of _filters
   *
   * @private
   * @param  {int} index
   * @return {bool} true
   */
  _inactiveFilterByIndex(index)
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
  _updateFilterByIndex(index, filter)
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
  handle()
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
  getDataByIndex(index)
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
  getResultByIndex(index)
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
  * @return {object}          {'group1': ineratee return, 'group2': valueIteratee return}
  */
  getResultsGroupBy(
    field,
    labelIteratee = (groupRecords, groupField) => groupField,
    valueIteratee = groupRecords => groupRecords.length,
  )
  {
    return map(
      groupBy(this.results, x => x[field]),
      (groupRecords, groupField) =>
      ({
        label: labelIteratee(groupRecords, groupField),
        value: valueIteratee(groupRecords, groupField),
      }),
    );
  }
}

export default Data;
