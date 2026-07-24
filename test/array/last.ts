import { expect } from 'chai';
import { last } from '../../src/array';

describe('array: last', () => {
  it('last element', () => {
    expect(last([10, 20, 30])).to.equal(30);
  });

  it('single element', () => {
    expect(last([42])).to.equal(42);
  });

  it('keeps falsy values', () => {
    expect(last([1, 2, 0])).to.equal(0);
  });

  it('empty array -> undefined', () => {
    expect(last([])).to.equal(undefined);
  });
});
