var path = require('path');

let minimize = false;
let nameSuffix = 'development';

if (process.env.NODE_ENV === 'production') {
  minimize = true;
  nameSuffix = 'production.min';
}

module.exports = {
  mode: 'production',
  entry: {
    'dmn-viewer': './lib/Viewer',
    'dmn-modeler': './lib/Modeler'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `[name].${nameSuffix}.js`,
    library: 'DmnJS',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            plugins: [
              'inferno',
              'transform-object-rest-spread',
              'transform-class-properties'
            ],
            presets: [ 'env' ]
          }
        }
      }
    ]
  },
  optimization: {
    minimize
  }
};