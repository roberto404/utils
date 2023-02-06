export type featureType =
{
  type: 'Feature',
  properties: {
    id: number,
    routeId: number,
    type: 'poi' | 'point' | 'route' | 'track',
    title?: string,
    color?: string,
    size?: string,
    symbol?: string,
  },
  geometry: {
    type: 'Point' | 'LineString',
    coordinates: Array<number> | Array<Array<number>>,
  },
};


export type featureCollectionType =
{
  title?: string,
  type: 'FeatureCollection',
  features: Array<featureType>,
}


export type featureQueryType =
{
  id?: number,
  routeId?: number,
  type?: 'poi' | 'point' | 'route' | 'track',
};


export type coordType = Array<number>;
