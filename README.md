# utils &middot; [![travis build](https://img.shields.io/circleci/build/github/roberto404/ui)](https://app.circleci.com/organization/github/roberto404/) [![codecov coverage](https://img.shields.io/codecov/c/github/roberto404/utils.svg)](https://codecov.io/gh/roberto404/utils) [![version](https://img.shields.io/npm/v/@1studio/utils.svg)](http://npm.im/@1studio/utils) [![commit](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![type](https://img.shields.io/badge/type%20checking-typescript-yellow.svg)](https://www.typescriptlang.org/)


A collection of useful utilities with Typescript type checking (since 5.0). - older version use Flow type checking.

## Installation

Using npm:
```shell
$ npm i -S @1studio/utils
```
Transpiler for the Flow:
```shell
$ npm i -D @babel/core @babel/preset-env @babel/preset-typescript babel-loader
```
.babelrc
```json
{
  "presets": ["@babel/preset-env", "@babel/preset-typescript"],
  "plugins": ["@babel/plugin-transform-runtime", "@babel/plugin-proposal-optional-chaining", "@babel/plugin-proposal-object-rest-spread", "@babel/plugin-proposal-class-properties"],
  "env": {
    "production": {
      "presets": ["babel-minify"]
    }
  }
}
```
webpack.config.js
```javascript
module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules\/(?!@1studio)/],
        use: [{
          loader: 'babel-loader'
        }]
      },
    ],
  }
```


## Manual

Example (ES6):
```javascript
import { getDistanceFromLatLonInKm } from '@1studio/utils/geometry';

const distance = getDistanceFromLatLonInKm(47.4925, 19.0513, 40.71448, -74.00598);
// Budapest <-> New York distance in km
```

Example (direct import):
```javascript
import checkPropTypes from '@1studio/utils/propType/checkPropTypes'

checkPropTypes('string', PropTypes.number);
// -> [errors]
```


Example (Flow):
```javascript
// @flow

import clamp from '@1studio/utils/math/clamp';

clamp('a');
// => Flow errors
```

[Read more](./MANUAL.md).

## License

@1studio/utils is [BSD licensed](./LICENSE).
