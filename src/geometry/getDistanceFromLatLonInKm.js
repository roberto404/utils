import deg2rad from './deg2rad';

/**
 * Radius of the earth in km
 *
 * @since 1.0.0
 * @private
 * @type {Number}
 */
const R = 6371;

/**
 * Calculate distance two  geographic coordinates
 * Decimal (World Geodetic System WGS84)
 *
 * @static
 * @memberof geometry
 * @requires deg2rad
 * @param  {int} lat1   From GPS latitude
 * @param  {int} lon1   From GPS longitude
 * @param  {int} lat2   To GPS latitude
 * @param  {int} lon2   To GPS longitude
 * @return {int}       distance in km
 * @example
 *
 * getDistanceFromLatLonInKm(47.4925, 19.0513, 40.71448, -74.00598);
 * // => 7008
 * // Budapest - New York distance
 *
 */
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) =>
{
  const dLat = deg2rad(lat2 - lat1);  // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
      (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
      (Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2))
  ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
};

export default getDistanceFromLatLonInKm;
