import { expect } from 'chai';
import { max } from '../../src/array';

describe('array: max', () => {
  it('maximum value', () => {
    expect(max([3, 1, 2])).to.equal(3);
  });

  it('coerces numeric strings', () => {
    expect(max(['3', 1, 2])).to.equal(3);
  });

  it('ignores non-numeric values', () => {
    expect(max([5, 'x', 2])).to.equal(5);
  });

  it('handles negatives', () => {
    expect(max([-1, -5, -3])).to.equal(-1);
  });

  it('empty array -> 0', () => {
    expect(max([])).to.equal(0);
  });
});
