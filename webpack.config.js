/**
 * Requires
 */
const merge = require('webpack-merge');
const { join } = require('path');

/**
 * Variables
 */
const PATHS = {
  src: join(__dirname, 'src'),
  dist: join(__dirname, 'build'),
};

 /**
  * Common Configuration
  */
const Common = {
  context: PATHS.src,
  entry: {
    app: './build.js',
  },
  output: {
    filename: 'utils.js',
    path: PATHS.dist,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
        }],
      },
    ],
  },
};


module.exports = (env) =>
{
  /**
   * Production Configuration
   */
  if (env.prod)
  {
    return merge([
      Common,
    ]);
  }

  return merge([
    Common,
    {
      devtool: 'eval',
      devServer: {
        contentBase: PATHS.dist,
        compress: true,
        port: 9000,
        public: 'localhost:9000',
      },
    },
  ]);
};
