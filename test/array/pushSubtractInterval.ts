// @ts-nocheck

import { expect, should } from 'chai';
import pushSubtractInterval from '../../src/array/pushSubtractInterval';

should();


type Interval = [number, number];

const intervals = [
  [-0.8, 0.8],
  [2.12, 3.17],
  [
    0.79,
    2.13
  ],
  [2.17, 3.19],
];




describe('pushSubtractInterval', () => {
  it('should return intervals with missing parts of new interval added', () => {
    const intervals: Interval[] = [[1, 2], [3, 4]];
    const newInterval: Interval = [1, 4];
    const result = pushSubtractInterval(intervals, newInterval);
    expect(result).to.deep.equal([[1, 2], [2, 3], [3, 4]]);
  });

  it('should handle cases where the new interval is fully within an existing interval', () => {
    const intervals: Interval[] = [[1, 5]];
    const newInterval: Interval = [2, 3];
    const result = pushSubtractInterval(intervals, newInterval);
    expect(result).to.deep.equal([[1, 5]]);
  });

  it('should handle cases where new interval is completely disjoint', () => {
    const intervals: Interval[] = [[1, 2], [4, 5]];
    const newInterval: Interval = [2, 4];
    const result = pushSubtractInterval(intervals, newInterval);
    expect(result).to.deep.equal([[1, 2], [2, 4], [4, 5]]);
  });

  it('should add interval when no overlap exists', () => {
    const intervals: Interval[] = [[1, 2], [5, 6]];
    const newInterval: Interval = [3, 4];
    const result = pushSubtractInterval(intervals, newInterval);
    expect(result).to.deep.equal([[1, 2], [3, 4], [5, 6]]);
  });

  it('should handle edge cases where intervals are adjacent but not overlapping', () => {
    const intervals: Interval[] = [[1, 2], [3, 4]];
    const newInterval: Interval = [2, 3];
    const result = pushSubtractInterval(intervals, newInterval);
    expect(result).to.deep.equal([[1, 2], [2, 3], [3, 4]]);
  });
});