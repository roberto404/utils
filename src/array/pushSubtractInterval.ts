
type Interval = [number, number];

function pushSubtractInterval(intervals: Interval[], newInterval: Interval): Interval[] {

  const result: Interval[] = [];

  let [start, end] = newInterval;

  intervals.forEach(([iStart, iEnd]) => {
    // Ha az új intervallum átfedésben van a meglévővel, akkor kivonjuk az átfedést
    if (start < iEnd && end > iStart) {
      if (start < iStart) {
        result.push([start, iStart]);
      }
      // Frissítjük a kezdőértéket az átfedés utáni értékre
      start = Math.max(start, iEnd);
    }
  });

  // Ha maradt lefedetlen rész az új intervallumból, azt hozzáadjuk
  if (start < end) {
    result.push([start, end]);
  }

  return [...intervals, ...result].sort((a, b) => a[0] - b[0]);
}

export default pushSubtractInterval;