import { expect, should } from 'chai';
import ArrayMethods from '../../src/array'

const { sort } = ArrayMethods;


const data = [
  { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
  { id: 2, name: 'Taylor R. Fallin', gender: 2, visits: '2017-07-22' },
  { id: 3, name: 'Jose C. Rosado', gender: 1, visits: '2017-07-20' },
  { id: 4, name: 'Sammy C. Brandt', gender: 1, visits: '2017-07-10' },
  { id: 5, name: 'June K. Jenkins', gender: 2, visits: '2017-06-10' },
  { id: 6, name: 'Pamela R. Benson', gender: 2, visits: '2017-05-23' },
  { id: 7, name: 'James H. Kelly', gender: 1, visits: '2017-04-23' },
  { id: 8, name: 'Joseph D. Black', gender: 1, visits: '2017-03-23' },
  { id: 9, name: 'Kellie E. Franklin', gender: 2, visits: '2017-02-23' },
  { id: 10, name: 'Wayne D. Price', gender: 1, visits: '2017-01-23' },
  { id: 11, name: 'Michael P. Danley', gender: 1, visits: '2016-07-23' },
  { id: 12, name: 'Weston S. Taylor', gender: 1, visits: '2015-07-23' },
];

[12, 11, 10, 8, 7, 4, 3, 1, 9, 6, 5, 2]

should();

describe('ArrayMethods: sort', () =>
{
  it('order id desc', () =>
  {
    const method = (a, b) => a.id < b.id;
    sort(data, method)[0].id.should.to.equal(12);
  });

  it('order gender asc', () =>
  {
    const method = (a, b) => a.gender > b.gender;
    sort(data, method).map(i => i.id).should.to.deep.equal([1, 3, 4, 7, 8, 10, 11, 12, 2, 5, 6, 9]);
  });

  it('order gender asc, id desc', () =>
  {
    const method = (a, b) => !(a.gender < b.gender || a.id > b.id)

    sort(data, method).map(i => i.id).should.to.deep.equal([12, 11, 10, 8, 7, 4, 3, 1, 9, 6, 5, 2]);
  });
});
