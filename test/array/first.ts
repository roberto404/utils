import { expect } from 'chai';
import { first } from '../../src/array';

describe('array: first', () => {
  it('first element', () => {
    expect(first([10, 20, 30])).to.equal(10);
  });

  it('single element', () => {
    expect(first([42])).to.equal(42);
  });

  it('keeps falsy values', () => {
    expect(first([0, 1, 2])).to.equal(0);
  });

  it('empty array -> undefined', () => {
    expect(first([])).to.equal(undefined);
  });
});
