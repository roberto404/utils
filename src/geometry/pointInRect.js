/**
 * Check a point is inside of a rectangle
 *
 * @since 1.2.0
 * @static
 * @memberof geometry
 * @param {[object]} a observed point
 * @param {[object]} b rectangle top left corner
 * @param {[object]} c rectangle bottom right corner
 * @return {bool}
 * @example
 *
 pointInRect(
   { x: 1, y: 1 },
   { x: 1, y: 2 },
   { x: 1, y: 4 },
 )
 // => false
 */
 const pointInRect = (a, b, c) =>
    (a.x >= Math.min(b.x, c.x) && a.x <= Math.max(b.x, c.x)
    && a.y >= Math.min(b.y, c.y) && a.y <= Math.max(b.y, c.y));

 export default pointInRect;
