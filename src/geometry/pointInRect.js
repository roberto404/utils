// @flow

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
 const pointInRect =
 (
   point: { x: number, y: number },
   lineTopLeft: { x: number, y: number },
   lineBottomRight: { x: number, y: number },
 ): bool =>
    (
      point.x >= Math.min(lineTopLeft.x, lineBottomRight.x)
      && point.x <= Math.max(lineTopLeft.x, lineBottomRight.x)
      && point.y >= Math.min(lineTopLeft.y, lineBottomRight.y)
      && point.y <= Math.max(lineTopLeft.y, lineBottomRight.y)
    );

 export default pointInRect;
