// @flow

// npx babel-node ./examples/array
// or watch:
// npx babel-watch ./examples/array


import mean from 'lodash/mean';
import { pivotTable, count, countUnique } from '../src/array';

import { collectionGroupBy } from '../src/array/pivotTable';


const data = [
  { "id": 1, "name": "Megan J. Cushman", "gender": '1', "age": '22', "visits": "2017-07-23" },
  { "id": 2, "name": "Taylor R. Fallin", "gender": '2', "age": '26', "visits": "2017-07-22" },
  { "id": 3, "name": "Jose C. Rosado", "gender": 1, "age": '28', "visits": "2017-07-22" },
  { "id": 4, "name": "Sammy C. Brandt", "gender": 1, "age": '32', "visits": "2017-07-22" },
  { "id": 5, "name": "June K. Jenkins", "gender": 2, "age": '26', "visits": "2017-06-10" },
  { "id": 6, "name": "Pamela R. Benson", "gender": 2, "age": '28', "visits": "2017-05-23" },
  { "id": 7, "name": "James H. Kelly", "gender": 1, "age": '22', "visits": "2017-04-23" },
  { "id": 8, "name": "Joseph D. Black", "gender": 1, "age": '26', "visits": "2017-03-23" },
  { "id": 9, "name": "Kellie E. Franklin", "gender": 2, "age": '32', "visits": "2017-02-23" },
  { "id": 10, "name": "Wayne D. Price", "gender": 1, "age": '32', "visits": "2017-01-23" },
  { "id": 11, "name": "Michael P. Danley", "gender": 1, "age": '22', "visits": "2016-07-23" },
  { "id": 12, "name": "Weston S. Taylor", "gender": 1, "age": '22', "visits": "2015-07-23" },
];




console.log(

  // pivotTable(data, 'gender', count),
  // => 12

  // pivotTable(data, 'gender', values => values.length),
  // => 12

  // pivotTable(data, 'gender', countUnique),
  // => 2

  // collectionGroupBy(data, 'gender'),
  // => [ { id: '1', title: 8 }, { id: '2', title: 4 } ]

  // pivotTable(data, 'gender', count, 'gender'),
  // => [ { id: '1', title: 8 }, { id: '2', title: 4 }, { id: 'count', title: 12 } ]

  // pivotTable(data, 'age', mean, 'visits'),
  // => { id: '2017-07-23', title: 22 }, { id: '2017-07-22', title: 28.666666666666668 } ...,

  // pivotTable(data, 'age', mean, ['visits', 'gender']),
  // => { id: '2017-07-23', title: [ { id: '1', title: 8 }, { id: '2', title: 4 }, { id: 'mean', title: 12 } ] }, ...

  pivotTable(data, mean),
  // => { id: 6.5, name: NaN, gender: 1.3333333333333333, age: 26.5, visits: NaN }
);
