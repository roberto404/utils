import { should } from 'chai';
import { min, max, first, last } from '../../src/array';

should();

describe('array reducers: min / max / first / last', () => {
  const numbers = [30, 10, 20];

  it('min / max (numeric, coerces strings, ignores NaN)', () => {
    min(numbers).should.to.equal(10);
    max(numbers).should.to.equal(30);
    min(['3', 1, 2]).should.to.equal(1);
    max([1, 'x', 5]).should.to.equal(5);
  });

  it('first / last', () => {
    (first(numbers) as number).should.to.equal(30);
    (last(numbers) as number).should.to.equal(20);
  });

  it('empty arrays', () => {
    min([]).should.to.equal(0);
    max([]).should.to.equal(0);
    (first([]) === undefined).should.to.equal(true);
    (last([]) === undefined).should.to.equal(true);
  });
});
