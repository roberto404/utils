import pointInRect from './pointInRect';

/**
 * Intersection of two lines
 *
 * @since 1.2.0
 * @static
 * @memberof geometry
 * @param  {object} a1 starting points of line A
 * @param  {object} a2 ending points of line A
 * @param  {object} b1 starting points of line B
 * @param  {object} b2 ending points of line B
 * @return {object}    Intersection point coorinate
 * @example
 *
 twoLineIntersection(
   { x: 5, y: 10 },
   { x: 5, y: 1 },
   { x: 1, y: 5 },
   { x: 10, y: 5 },
 )
 // => { x: 5, y: 5 }
 */
const twoLineIntersection = (
  a1: { x: number, y: number },
  a2: { x: number, y: number },
  b1: { x: number, y: number },
  b2: { x: number, y: number },
): { x: number, y: number } | null =>
{
  const dax = (a1.x - a2.x);
  const dbx = (b1.x - b2.x);
  const day = (a1.y - a2.y);
  const dby = (b1.y - b2.y);

  const Den = (dax * dby) - (day * dbx);

  if (Den === 0)
  {
    // parallel
    return null;
  }

  const A = (a1.x * a2.y) - (a1.y * a2.x);
  const B = (b1.x * b2.y) - (b1.y * b2.x);

  const I = {
    x: ((A * dbx) - (dax * B)) / Den,
    y: ((A * dby) - (day * B)) / Den,
  };

  if (pointInRect(I, a1, a2) && pointInRect(I, b1, b2))
  {
    return I;
  }

  return null;
};

export default twoLineIntersection;
