import { expect, should } from 'chai';
import { count, countUnique, unique, produceNumericArray } from '../../src/array';

should();

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
});
