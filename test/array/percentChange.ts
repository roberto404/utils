import { should } from 'chai';
import { percentChange } from '../../src/array';

should();

describe('array: percentChange', () => {
  it('positive change', () => {
    percentChange([100, 130]).should.to.equal(30);
  });

  it('negative change', () => {
    percentChange([200, 150]).should.to.equal(-25);
  });

  it('uses first & last only', () => {
    percentChange([100, 999, 110]).should.to.equal(10);
  });

  it('rounds to given digits', () => {
    percentChange([0.7413, 0.7446], 2).should.to.equal(0.45);
  });

  it('base 0 -> 0 (no division by zero)', () => {
    percentChange([0, 50]).should.to.equal(0);
  });

  it('empty array -> 0', () => {
    percentChange([]).should.to.equal(0);
  });
});
