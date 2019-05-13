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

for (let i = 0; i < 10000; i += 1)
{
  data.push({
    id: i,
    title: Math.random().toString(36).replace(/[^a-z]+/g, ''),
    value: Math.round(Math.random() * 100)
  });
}

const sortMethod = column => (recordOne, recordTwo) =>
{
  const a = recordOne.column || '';
  const b = recordTwo.column || '';

  if (!isNaN(a) && !isNaN(b))
  {
    return +(a >= b);
  }

  return a.toLowerCase().localeCompare(b.toLowerCase());
};

suite
  .add('#A', () =>
  {
    data.sort(sortMethod('title'));
  })
  .add('#B', () =>
  {
    sort(data, sortMethod('title'));
  })
  // add listeners
  .on('cycle', (event) =>
  {
    console.log(String(event.target));
  })
  .on('complete', () =>
  {
    console.log('Fastest is ' + suite.filter('fastest').map('name'));

    /**
     * hist suite runs num / sec
     * suite[0].hz
     */
    console.log(`${suite[1].name} runs ${Math.round((suite[1].hz / suite[0].hz) * 10) / 10}x ${suite[1].hz > suite[0].hz ? 'fastest' : 'slowest'} then ${suite[0].name}`);
  })
  // run async
  .run({ 'async': true });
