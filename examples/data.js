// @flow

// npx babel-node ./examples/data
// or watch:
// npx babel-watch ./examples/data

import Data from '../src/models/data';


/**
 * Flow works
 */

const rawData = [
  { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
  { id: 2, name: 'Taylor R. Fallin', gender: 2, visits: '2017-07-22' },
  { id: 3, name: 'Jose C. Rosado', gender: 1, visits: '2017-07-20' },
  { id: 4, name: 'Sammy C. Brandt', gender: 1, visits: '2017-07-10' },
];

const settings = {
  paginate:
  {
    page: 1,
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
      {
        if (typeof record.name === 'string')
        {
          return record.name
            .toString()
            .toLowerCase()
            .indexOf(value.toString().toLowerCase()) >= 0;
        }

        return false;
      },
      arguments: [],
      status: false,
    },
  ],
};

const Person: Data = new Data(rawData, settings);

Person.order = { column: 'visits' };
Person.filters = [
  {
    id: "id",
    handler: (a,b) => a,
    status: true,
  },
];

Person.paginate = {
  page: 3,
  limit: 1,
};

// console.log(
//
//   Person.filters,
//   // Person.getResultsGroupBy('gender', (a, b) => a.name),
// );
