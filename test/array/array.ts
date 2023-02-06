// @ts-nocheck

import { expect, should } from 'chai';
import sumBy from 'lodash/sumBy';
import mean from 'lodash/mean';

import count from '../../src/array/count';
import countUnique from '../../src/array/countUnique';
import unique from '../../src/array/unique';
import produceNumericArray from '../../src/array/produceNumericArray';
import pivotTable, { collectionGroupBy } from '../../src/array/pivotTable';

should();


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



describe('ArrayMethods', () =>
{
  it('count', () =>
  {
    count([1, 2, 3]).should.to.equal(3);
    count(['a', 'b', 'c']).should.to.equal(3);
    count(['a', undefined, {}]).should.to.equal(3);
  });

  it('countUnique', () =>
  {
    countUnique([1, 1, 3]).should.to.equal(2);
    countUnique(['a', 'a', 'c']).should.to.equal(2);
    countUnique([undefined, undefined, {}]).should.to.equal(1);
  });

  it('unique', () =>
  {
    unique([1, '1', 3]).should.to.deep.equal([1, '1', 3]);
    unique(['a', 'a', 'c']).should.to.deep.equal(['a', 'c']);
    unique([undefined, undefined, {}]).should.to.deep.equal([{}]);
  });

  it('produceNumericArray', () =>
  {
    // normal method
    produceNumericArray(3, 5).should.to.deep.equal([3, 4, 5]);
    produceNumericArray(3, 5, n => n + 1).should.to.deep.equal([4, 5, 6]);

    // wrong attributes
    produceNumericArray(3).should.to.deep.equal([]);
    produceNumericArray('a', 'b').should.to.deep.equal([]);
    produceNumericArray(3, 5, 'ff').should.to.deep.equal([3, 4, 5]);
  });


  it('pivotTable', () =>
  {
    pivotTable(data, 'gender', count).should.to.equal(12);
    pivotTable(data, 'gender', values => values.length).should.to.equal(12);
    pivotTable(data, 'gender', countUnique).should.to.equal(2);

    const genderCountGroupByGender = pivotTable(data, 'gender', count, 'gender');
    // => [ { id: '1', title: 8 }, { id: '2', title: 4 }, { id: 'count', title: 12 } ]

    genderCountGroupByGender.length.should.to.equal(pivotTable(data, 'gender', countUnique) + 1);
    genderCountGroupByGender[genderCountGroupByGender.length - 1].title.should.to.equal(pivotTable(data, 'gender', count));
    sumBy(genderCountGroupByGender, 'title').should.to.equal(genderCountGroupByGender[genderCountGroupByGender.length - 1].title * 2);

    pivotTable(data, 'age', mean, 'visits')[1].title.should.to.equal((26 + 28 + 32) / 3);
    // => { id: '2017-07-23', title: 22 }, { id: '2017-07-22', title: 28.666666666666668 } ...,

    const multidimension = pivotTable(data, 'age', mean, ['visits', 'gender']);

    multidimension
      .find(({ id }) => id === '2017-07-22').title
      .find(({ id }) => id === '1').title
      .should.to.equal(30);
    // => { id: '2017-07-23', title: [ { id: '1', title: 8 }, { id: '2', title: 4 }, { id: 'mean', title: 12 } ] }, ...


    pivotTable(data, mean).id.should.to.equal(6.5);
    // => { id: 6.5, name: NaN, gender: 1.3333333333333333, age: 26.5, visits: NaN }

    //null
    expect(pivotTable()).to.be.a('null');
    expect(pivotTable({})).to.be.a('null');
    expect(pivotTable([])).to.be.a('null');

    // helper
    sumBy(collectionGroupBy(data, 'gender'), 'title').should.to.equal(data.length);
    // => [ { id: '1', title: 8 }, { id: '2', title: 4 } ]

  });
});
