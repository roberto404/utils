import { expect, should } from 'chai';
import ArrayMethods from '../../src/array'

const { count, countUnique, unique } = ArrayMethods;

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
});
