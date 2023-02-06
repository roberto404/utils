/**
 * Requires
 */
const path  = require('path');


/* !-- Constants */

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'build'),
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
        test: /\.(j|t)s(x)?$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
        }],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  }
};


module.exports = (env) =>
{
  /**
   * Production Configuration
   */
  if (env.production)
  {
    return {
      ...Common,
    };
  }

  return {
    ...Common,
    devtool: 'eval', // 'source-map',
    devServer:
    {
      static: 
      {
        directory: Common.output.path,
      },
      compress: true,
      hot: true,
      liveReload: true,
      port: 9000,
      historyApiFallback: true,
      open: {
        target: ['http://localhost:9000'],
        app: {
          name: 'google chrome'
        },
      },
    },
  };
};
