import { chain, forIn, isEmpty, isEqual, slice, clone, findIndex } from 'lodash';

const _ =
  {
    chain,
    forIn,
    isEmpty,
    isEqual,
    slice,
    clone,
    findIndex,
  };

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
   */
  constructor(data, settings = {})
  {
    if (data === undefined || typeof settings !== typeof {})
    {
      return false;
    }

    this._data = _.clone(data);

    this._results = _.clone(this._data);

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
    if (_.isEmpty(settings))
    {
      return;
    }

    const order = _.clone(this._order);

    if (settings.column !== this._order.column &&
        Object.keys(this.data[0]).indexOf(settings.column) !== -1)
    {
      order.column = settings.column;
    }

    if (settings.direction !== this.order.direction &&
        DIRECTIONS.indexOf(settings.direction) !== -1)
    {
      order.direction = settings.direction;
    }

    if (!_.isEqual(order, this.order))
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
      const filterIndex = _.findIndex(this.filters, { id: filter.id });

      if (filterIndex === -1)
      {
        if (this._registerNewFilter(filter))
        {
          modified = true;
        }
      }
      else if (!filter.arguments || _.isEmpty(filter.arguments))
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
    if (typeof options !== 'object')
    {
      return;
    }

    if (typeof options.limit === 'number')
    {
      this._paginate.limit = options.limit;
    }

    this._paginate.total = this._results.length;
    this._paginate.totalPage = Math.ceil(this._paginate.total / this._paginate.limit);

    if (typeof options.page === 'number' &&
        options.page > 0 &&
        options.page <= this._paginate.totalPage)
    {
      this._paginate.page = Math.ceil(options.page);
    }

    const offset = (this._paginate.page - 1) * this._paginate.limit;

    this._paginate.results = _.slice(this._results, offset, offset + this._paginate.limit);
    this._paginate.nextPage = (this._paginate.page < this._paginate.totalPage)
      ? this._paginate.page + 1 : false;
    this._paginate.prevPage = (this._paginate.page > 1)
      ? this._paginate.page - 1 : false;
  }

  /* !- Public methods */

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

    _.forIn(FILTER_SCHEME, (value, key) =>
    {
      if (typeof filter[key] === value)
      {
        newFilter[key] = filter[key];
      }
    });

    if (!_.isEmpty(newFilter))
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

    _.forIn(newFilter, (value, key) =>
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
    this._results = _.clone(this._data);

    if (!_.isEmpty(this.filters))
    {
      this._filter();
    }

    this._sort();
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
    valueIteratee = groupRecords => groupRecords.length,
    labelIteratee = (groupRecords, groupField) => groupField,
  )
  {
    return _
        .chain(this.results)
        .groupBy(x => x[field])
        .map((groupRecords, groupField) =>
        ({
          label: labelIteratee(groupRecords, groupField),
          value: valueIteratee(groupRecords, groupField),
        }))
        .value();
  }
}

module.exports = Data;
