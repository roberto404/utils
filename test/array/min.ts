import { expect } from 'chai';
import { min } from '../../src/array';

describe('array: min', () => {
  it('minimum value', () => {
    expect(min([3, 1, 2])).to.equal(1);
  });

  it('coerces numeric strings', () => {
    expect(min(['3', 1, 2])).to.equal(1);
  });

  it('ignores non-numeric values', () => {
    expect(min([5, 'x', 2])).to.equal(2);
  });

  it('handles negatives', () => {
    expect(min([-1, -5, 3])).to.equal(-5);
  });

  it('empty array -> 0', () => {
    expect(min([])).to.equal(0);
  });
});
