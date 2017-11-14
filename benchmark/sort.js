// npx babel-node ./benchmark/sort.js

import Benchmark from 'benchmark';
import sort from '../src/array/sort';

const suite = new Benchmark.Suite();

// const data = [
//   { id: 1, title: 'foo', value: 3 },
//   { id: 2, title: 'foo2', value: 32 },
//   { id: 3, title: 'foo3', value: 33 },
//   { id: 4, title: 'foo4', value: 34 },
// ];

const data = [];

for (let i = 0; i < 1000; i++)
{
  data.push({
    id: i,
    value: Math.round(Math.random() * 100)
  });
}

const sortMethod = (recordOne, recordTwo) =>
{
  const a = recordOne.title || '';
  const b = recordTwo.title || '';

  if (!isNaN(a) && !isNaN(b))
  {
    return +(a >= b);
  }

  return a.toLowerCase().localeCompare(b.toLowerCase());
};

suite
  .add('#A', () =>
  {
    // list.sort((a,b) => a>b);
    data.sort(sortMethod);
  })
  .add('#B', () =>
  {
    sort(data, sortMethod);
  })
  // add listeners
  .on('cycle', (event) =>
  {
    console.log(String(event.target));
  })
  .on('complete', () =>
  {
    // console.log('Fastest is ' + suite.filter('fastest').map('name'));
    console.log(Math.round(suite[1].hz / suite[0].hz * 100) - 100 +'%');
  })
  // run async
  .run({ 'async': true });
