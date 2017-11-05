// @flow

// npx babel-node ./examples/geometry
// or watch:
// npx babel-watch ./examples/geometry

import
{
  deg2rad,
  // distance,
  // getDistanceFromLatLonInKm,
  // pointInRect,
  // twoLineIntersection,
}
from '../src/geometry';

/**
 * Flow errors
 */

// distance('pointA', 'pointB');
// => SyntaxError

/**
 * Flow works
 */

console.log(
  deg2rad(180),
  // => π
);
