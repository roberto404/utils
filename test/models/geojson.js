import { expect, should } from 'chai';
import deepFreeze from 'deep-freeze';
import GeoJson from '../../src/models/geoJson';

should();

const sampleGeoJson = {
  poi1: {
    type: 'Feature',
    properties: {
      id: 1,
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
  },
  poi2: {
    type: 'Feature',
    properties: {
      id: 2,
      routeId: 2,
      type: 'poi',
    },
    geometry: {
      type: 'Point',
      coordinates: [
        11.337890625,
        43.75572101568019,
      ],
    },
  },
  point1: {
    type: 'Feature',
    properties: {
      id: 1,
      routeId: 1,
      type: 'point',
    },
    geometry: {
      type: 'Point',
      coordinates: [
        11.337890625,
        43.75572101568019,
      ],
    },
  },
  route1: {
    type: 'Feature',
    properties: {
      id: 1,
      routeId: 1,
      type: 'route',
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [
          11.190261840820312,
          43.77803507867666,
        ],
        [
          11.269912719726562,
          43.812729297610915,
        ],
        [
          11.2774658203125,
          43.77877873741692,
        ],
      ],
    },
  },
};

const featureCollection = [
  sampleGeoJson.poi1,
  sampleGeoJson.route1,
  sampleGeoJson.poi2,
];


deepFreeze(featureCollection);

let Features;


describe.skip('Model: GeoJson:', () =>
{
  const env = process.env.NODE_ENV;

  before(() =>
  {
    process.env.NODE_ENV = 'production';
  });

  after(() =>
  {
    process.env.NODE_ENV = env;
  });

  beforeEach(() =>
  {
    Features = new GeoJson(featureCollection);
  });

  it('Initial', () =>
  {
    const feature2 = new GeoJson(featureCollection);
    featureCollection.should.to.deep.equal(feature2.collection.features);

    const feature3 = new GeoJson();
    feature3.collection.features.length.should.to.equal(0);
  });

  it('Initial error', () =>
  {
    let feature2;

    try
    {
      feature2 = new GeoJson(featureCollection[0]);
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
    }

    try
    {
      feature2 = new GeoJson({});
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
    }

    expect(feature2).to.be.an('undefined');
  });


  it('createFeature', () =>
  {
  });

  it('updateFeature', () =>
  {
  });

  it('deleteFeature', () =>
  {
  });


  it('createFeatureQuery', () =>
  {
  });

  it('getFeatureIndex', () =>
  {
  });

  it('getFeaturesByQuery', () =>
  {
    const selectedFeatures = Features.getFeaturesByQuery({ routeId: 1 });

    // össze kéne számoltatni és megvizsgalni h mindnek a routeId 1
    selectedFeatures.length.should.to.be.equal(2);
  });

  it('setFeature', () =>
  {
  });


  it('get poi', () =>
  {
    Features.poi.should.to.be.deep.equal(sampleGeoJson.poi2);
  });

  it('set poi', () =>
  {
    const newPoi = {
      ...sampleGeoJson.poi1,
      properties: {
        ...sampleGeoJson.poi1.properties,
        id: 10000,
      },
    };

    Features.poi = newPoi;
    Features.poi.should.to.be.deep.equal(newPoi);

    const oldPoi = {
      ...sampleGeoJson.poi1,
      properties: {
        ...sampleGeoJson.poi1.properties,
        title: 'oldPoi',
      },
    };

    const prevLength = Features.collection.features.length;
    Features.poi = oldPoi;
    const nextLength = Features.collection.features.length;

    prevLength.should.to.be.equal(nextLength);
  });

  it('get pois', () =>
  {
  });

  it('set pois', () =>
  {
  });

  it('get point', () =>
  {

  });

  it('set point', () =>
  {
    // create with coordinate
    const coord = [12, 13];
    Features.point = coord;
    Features.point.geometry.coordinates.should.to.be.deep.equal([12, 13]);

    // init route deleted becuase it has only one point
    (Features.route === undefined).should.to.be.true;

    // create with feature
    Features.point = sampleGeoJson.point1;

    // init route modified new coordinates
    Features.route.geometry.coordinates.should.to.be.deep.equal(
      [coord, sampleGeoJson.point1.geometry.coordinates]);
  });

  it('get route', () =>
  {
  });

  it('set route', () =>
  {
  });

  it('get track', () =>
  {
  });

  it('set track', () =>
  {
  });


  it('getType', () =>
  {
  });

  it('isPoi', () =>
  {
  });

  it('isRoute', () =>
  {
  });

  it('isTrack', () =>
  {
  });

  it('createId', () =>
  {
  });
});
