const path = require('path');
const fs = require('fs');

const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const BannerPlugin = webpack.BannerPlugin;

let minimize;
let nameSuffix;
let banner;

if (process.env.NODE_ENV === 'production') {
  minimize = true;
  nameSuffix = 'production.min';
  banner = fs.readFileSync(__dirname + '/resources/banner-min.txt', 'utf8');
} else {
  minimize = false;
  nameSuffix = 'development';
  banner = fs.readFileSync(__dirname + '/resources/banner.txt', 'utf8');
}

const version = require('./package').version;

const bannerConfig = {
  version,
  date: today()
};


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
  plugins: [
    new BannerPlugin({
      banner: processTemplate(banner, bannerConfig),
      raw: true
    })
  ],
  optimization: {
    minimize,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: /license|@preserve/
          }
        }
      })
    ]
  }
};


// helpers //////////////////////

function pad(n) {
  if (n < 10) {
    return '0' + n;
  } else {
    return n;
  }
}

function today() {
  const d = new Date();

  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDay())
  ].join('-');
}

function processTemplate(str, args) {
  return str.replace(/\{\{\s*([^\s]+)\s*\}\}/g, function(_, n) {

    var replacement = args[n];

    if (!replacement) {
      throw new Error('unknown template {{ ' + n + '}}');
    }

    return replacement;
  });
}