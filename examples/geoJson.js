// @flow

// npx babel-node ./examples/geoJson
// or watch:
// npx babel-watch ./examples/geoJson

import GeoJson from '../src/models/geoJson';


/**
 * Flow works
 */

const Features: GeoJson = new GeoJson([

]);

// change session time in minutes
Features.poi = 20;


console.log(Features.route);
