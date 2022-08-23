// @flow

/**
 * Determine if a point is inside of a polygon.
 *
 * @since 4.21.0
 * @static
 * @memberof geometry
 * @param  {array} point
 * @param  {array} polygon
 * @return {boolean}
 * @example
 * 
 * // array of coordinates of each vertex of the polygon
 * const polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
 * pointInPolygon([ 1.5, 1.5 ], polygon);
 * // => true
 */

function pointInPolygon(point, polygon)
{
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
  
  const x = point[0], y = point[1];
  
  let isInside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++)
  {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    
    const intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect)
    {
      isInside = !isInside;
    }
  }
  
  return isInside;
};


export default pointInPolygon;
