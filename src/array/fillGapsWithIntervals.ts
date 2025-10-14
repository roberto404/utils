
type Interval = [number, number];
type Intervals = Interval[];


function fillGapsWithIntervals(intervals: Intervals): Intervals {
  
  const filledIntervals = [];

  for (let i = 0; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    filledIntervals.push([start, end]);

    if (i < intervals.length - 1) {
      const [nextStart] = intervals[i + 1];
      if (end < nextStart) {
        filledIntervals.push([end, nextStart]);
      }
    }
  }

  return filledIntervals;
}

export default fillGapsWithIntervals;