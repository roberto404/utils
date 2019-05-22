// @flow

/* eslint-disable */

import request from 'superagent';
import find from 'lodash/find';
import serialize from '../object/serialize';
import distance from '../geometry/getDistanceFromLatLonInKm';
import clamp from '../math/clamp';


// 2Kb -> 0
import PropTypes, { checkPropTypes } from '../propType';


/* !- Types */

import type { featureType, featureCollectionType, featureQueryType, coordType } from './geoJson.type';

const FeatureType = PropTypes.shape({
  type: PropTypes.oneOf(['Feature']).isRequired,
  properties: PropTypes.shape({
    id: PropTypes.number,
    routeId: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['poi', 'point', 'route', 'track']).isRequired,
    title: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string,
    symbol: PropTypes.string,
  }).isRequired,
  geometry: PropTypes.shape({
    type: PropTypes.oneOf(['Point', 'LineString']).isRequired,
    coordinates: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number),
    ])).isRequired,
  }).isRequired,
});

const FeatureTypes = PropTypes.arrayOf(FeatureType);

const CoordType = PropTypes.arrayOf(PropTypes.number);


/* !- Constants */

const QUERY_PROPS = ['id', 'routeId', 'type'];

const GPX_XML = `<?xml version="1.0"?>
<gpx
  version="1.1"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  @content
</gpx>
`;


/* !- Helper function */

export const getType = (feature :featureType) :string => feature.properties.type;

export const isPoi = (feature :featureType) :boolean => getType(feature) === 'poi';
export const isPoint = (feature :featureType) :boolean => getType(feature) === 'point';
export const isRoute = (feature :featureType) :boolean => getType(feature) === 'route';
export const isTrack = (feature :featureType) :boolean => getType(feature) === 'track';

/**
 * Determine coordType or Array<coordType> too.
 * @param  {Any}  coord observed input
 * @return {Boolean}
 */
export const isCoord = (coord :any) :boolean =>
  Array.isArray(coord)
    && (
      (coord.length === 2 && coord.every(c => typeof c === 'number'))
      || (coord.every(cc => Array.isArray(cc) && cc.every(c => typeof c === 'number')))
    );

export const createId = () :number => new Date().getTime();

export const isEqualFeature = (query :featureQueryType) =>
  (feature :featureType) :boolean =>
    Object.keys(query).every(prop => feature.properties[prop] === query[prop]);


/**
 * [GeoJson description]
 */
class GeoJson
{
  /**
   * Feature Collection: poi, track, route
   * @type {Object}
   * @example
   * {
   *  type: 'FeatureCollection',
   *  features: [],
   * }
   */
  collection: featureCollectionType;

  /**
   * Id of selected Route
   * @type {integer}
   */
  routeId: number;

  /**
   * Routing delay setTimeout handle
   * @type {number}
   */
  routingTimeout: number


  constructor(features: Array<featureType> = [], options: {})
  {
    this.routeId = 1;
    this.options = {};

    if (
      checkPropTypes(
        features,
        FeatureTypes,
      )
    )
    {
      throw new Error('Invalid inital features. Only Array<featureType>');
    }

    this.collection = {
      title: '',
      type: 'FeatureCollection',
      features: [...features],
    };

    this.options = options;
  }

  /* !- Getter, setter */

  /**
   * Return last inserted POI
   * specific use getFeature(Query) or getPoi(Query)
   * @return {object} geoJson
   * @example
   {
     type: 'Feature',
     properties: {
       id: 111,
       routeId: 1,
       type: 'poi',
       color: '#7e7e7e',
       size: 'medium',
       symbol: 'house',
       title: 'Lorem Ipsum',
     },
     geometry: {
       type: 'Point',
       coordinates: [
         11.337890625,
         43.75572101568019,
       ],
     },
   }
   */
  get poi(): ?featureType
  {
    return this.collection.features
      .reverse()
      .find(feature =>isPoi(feature));
  }

  /**
   * Create or update feature
   * @param  {Object} feature
   */
  set poi(feature :featureType)
  {
    this.setFeature(feature);
  }

  get pois()
  {

  }

  set pois(geoJson)
  {

  }

  get point()
  {
    return this.collection.features
      .reverse()
      .find(feature =>isPoint(feature) && feature.properties.routeId === this.routeId);
  }

  /**
   * Create feature point by coordinate or GeoJson
   * update if it is exist and auto create route by point's routeId
   * @param  {Object|Array} featureOrCoord geojson or coord array [lng, lat]
   */
  set point(featureOrCoord :featureType | coordType)
  {
    let feature = featureOrCoord;

    if (
      !checkPropTypes(
        featureOrCoord,
        CoordType.isRequired,
      )
    )
    {
      feature = {
        type: 'Feature',
        properties: {
          id: createId(),
          routeId: this.routeId,
          type: 'point',
        },
        geometry: {
          type: 'Point',
          coordinates: featureOrCoord,
        },
      }
    }
    this.setFeature(feature);

    // routeID
    const routePoints = this.getFeaturesByQuery({ type: 'point', routeId: this.routeId });
    const routeCoordinates = routePoints.map(point => point.geometry.coordinates);
    this.route = routeCoordinates;
  }


//??? Ennek igy van értelme?
  get points() :Array<featureType>
  {
    return this.getFeaturesByQuery({ type: 'point' });
  }

  set points(features)
  {

  }




  /**
   * One feature which type='route' with currect routeId
   * @type {Object}
   */
  get route() :?featureType
  {
    return this.getFeatureByQuery({ type: 'route', routeId: this.routeId });
  }

  /**
   * Create route by geoJson or coordinates array
   * @param  {Object|Array} featureOrCoord
   * @example
   * Features.route = [[12.2, 12.3], [] ...]
   */
  set route(featureOrCoord :featureType | Array<coordType>)
  {
    let feature = featureOrCoord;

    if (isCoord(featureOrCoord))
    {
      feature = {
        type: 'Feature',
        properties: {
          // id,
          routeId: this.routeId,
          type: 'route',
        },
        geometry: {
          type: 'LineString',
          coordinates: featureOrCoord,
        },
      }
    }

    if (
      Array.isArray(feature)
      || checkPropTypes(
        feature,
        FeatureType.isRequired,
      )
      || feature.properties.type !== 'route'
    )
    {
      throw new Error('Invalid <featureType> or feature.properties.type must have "route"');
    }

    if (feature.geometry.coordinates.length > 1)
    {
      this.setFeature(feature);

      if (this.options.routing)
      {
        window.clearTimeout(this.routingTimeout);

        this.routingTimeout = setTimeout(
          () =>
          {
            const { url, params } = this.options.routing;
            // coordinates: '42.72895,43.05113|42.73246,43.05555|...',
            const coordinates = feature.geometry.coordinates.map(p => p.join(',')).join('|');

            request
              .get(url + serialize({ ...params, coordinates }))
              .then(response => this.track = response.body.features[0]);
          },
          (this.options.delay || 1) * 1000,
        );
      }
    }
    else
    {
      this.deleteFeature(feature);
      //TODO: delete track
    }
  }

  // get routes()
  // {
  //
  // }
  //
  // set routes(geoJson)
  // {
  //
  // }

  get track(): featureType
  {
    return this.getFeatureByQuery({ type: 'track', routeId: this.routeId });
  }

  set track(feature: featureType)
  {
    feature.properties.type = 'track';
    feature.properties.routeId = this.routeId;

    this.setFeature(feature);
  }

  // get tracks()
  // {
  //
  // }
  //
  // set tracks(geoJson)
  // {
  //
  // }

  getFeatureIndex(query: featureQueryType) :number
  {
    return this.collection.features.findIndex(isEqualFeature(query));
  }

  /**
   * Select all feature where query is equal
   * @return {Array} features
   */
  getFeaturesByQuery(query: featureQueryType) :Array<featureType>
  {
    return this.collection.features.filter(isEqualFeature(query));
  }

  /**
   * Select first feature where query is equal
   * @return {Array} features
   */
  getFeatureByQuery(query: featureQueryType) :featureType
  {
    return this.getFeaturesByQuery(query)[0];
  }

  /**
   * Update if feature exist, otherwise create this.
   * @return {Object} feature
   */
  setFeature(feature :featureType) :?featureType
  {
    const query = this.createFeatureQuery(feature);
    const featureIndex = this.getFeatureIndex(query);

    return featureIndex === -1 ?
      this.createFeature(feature) : this.updateFeature(feature, featureIndex);
  }





  /* !- Crud methods */

  createFeature(feature :featureType) :featureType
  {
    if (
      checkPropTypes(
        feature,
        FeatureType.isRequired,
      )
    )
    {
      throw new Error('Invalid feature. Only featureType');
    }

    this.collection.features.push({
      ...feature,
      properties: {
        id: createId(),
        ...feature.properties,
      }
    });

    this.handle();

    return this.collection.features.slice(-1)[0];
  }

  updateFeature(feature :featureType, featureIndex :number) :?featureType
  {
    if (!featureIndex || this.collection.features[featureIndex] === undefined)
    {
      featureIndex = this.getFeatureIndex(this.createFeatureQuery(feature));
    }

    if (featureIndex === -1 || this.collection.features[featureIndex] === undefined)
    {
      return undefined;
    }

    this.collection.features[featureIndex] = {
      ...feature,
      properties: {
        id: createId(),
        ...feature.properties,
      }
    };

    this.handle();

    return this.collection.features[featureIndex];
  }

  deleteFeature(feature :featureType) :void
  {
    const query = this.createFeatureQuery(feature);
    const index = this.getFeatureIndex(query);

    if (index !== -1)
    {
      this.collection.features.splice(index, 1);
    }

    this.handle();
  }


  /**
   * Create getFeature Query from feature
   * @param  {object} feature
   * @return {object}         query
   */
  createFeatureQuery(feature: featureType): featureQueryType
  {
    const query = {};

    Object.keys(feature.properties)
      .filter(prop => QUERY_PROPS.indexOf(prop) !== -1)
      .forEach(prop => query[prop] = feature.properties[prop]);

    return query;
  }


  /* !- Private methods */


  getDistance(feature:? featureType): number
  {
    const coordinates = (feature || this.track).geometry.coordinates;

    return coordinates.reduce(
      (result, coord, index) =>
      {
        if (index === 0)
        {
          return 0;
        }

        const prev = coordinates[index - 1];
        return result + distance(prev[1], prev[0], coord[1], coord[0]);
      },
      0,
    );
  }

  getElevation(feature:? featureType): { ascent: number, descent: number }
  {
    const coordinates = (feature || this.track).geometry.coordinates;

    let defaultResult = {
      ascent: 0,
      descent: 0,
    };

    if (!coordinates.length && !Array.isArray(coordinates[0]))
    {
      return defaultResult;
    }

    return coordinates.reduce(
      (result, coord, index) =>
      {
        if (index === 0)
        {
          return 0;
        }

        const prev = coordinates[index - 1];
        const elevation = coord[2] - prev[2];

        return {
          ascent: Math.max(elevation, 0) + (result.ascent || 0),
          descent: Math.min(elevation, 0) + (result.descent || 0),
        };
      },
      {},
    );
  }

  getAscent()
  {
  }

  getDescent()
  {
  }

  addRoutePoint()
  {

  }

  /**
   * Ivonke when collection change
   */
  handle(): void
  {
    if (this.options.onChange)
    {
      this.options.onChange(this.collection);
    }
  }

  flush(): void
  {
    this.collection = {
      title: '',
      type: 'FeatureCollection',
      features: [],
    };

    this.routeId = 1;

    window.clearTimeout(this.routingTimeout);
  }

  // <trk>
  //   <name>...</name>
  //   <trkseg>
  //     <trkpt lat="47.715897560119629" lon="18.866915702819824">
  //       <ele>#</ele>
  //     <trkpt/>
  //   </trkseg>
  // </trk>
  exportGPX(): string
  {
    const track = this.track.geometry.coordinates.map(coord => `
      <trkpt lon="${coord[0]}" lat="${coord[1]}">
        <ele>${coord[2]}</ele>
      </trkpt>
    `);

    const gpx = `
      <trk>
        <name>Route #${this.routeId}</name>
        <trkseg>
          ${track.join("")}
        </trkseg>
      </trk>
    `;

    return GPX_XML.replace('@content', gpx);
  }
}

/* eslint-enable */

export default GeoJson;
