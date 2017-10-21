# utils &middot; [![travis build](https://img.shields.io/travis/roberto404/utils.svg)](https://travis-ci.org/roberto404/utils) [![codecov coverage](https://img.shields.io/codecov/c/github/roberto404/utils.svg)](https://codecov.io/gh/roberto404/utils) [![version](https://img.shields.io/npm/v/@1studio/utils.svg)](http://npm.im/@1studio/utils)

A collection of useful utilities.

## Installation

Using npm:
```shell
$ npm i --save @1studio/utils
```

## Manual

Example (ES6):
```javascript
import { getDistanceFromLatLonIn } from '@1studio/utils/geometry';

const distance = getDistanceFromLatLonInKm(47.4925, 19.0513, 40.71448, -74.00598);
// Budapest <-> New York distance in km
```

[Read more](./MANUAL.md).

## License

@1studio/utils is [BSD licensed](./LICENSE).
