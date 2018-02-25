'use strict';

var path = require('path');

var exec = require('execa').sync,
    mkdirp = require('mkdirp').sync,
    cp = require('cpx').copySync,
    del = require('del').sync;

var dest = process.env.DISTRO_DIST || 'dist';


function resolve(module, sub) {
  var pkg = require.resolve(module + '/package.json');

  return path.dirname(pkg) + sub;
}

console.log('clean ' + dest);
del(dest);

console.log('mkdir -p ' + dest);
mkdirp(dest);

console.log('copy dmn-font to ' + dest + '/dmn-font');
cp(resolve('dmn-font', '/dist/{font,css}/**'), dest + '/assets/dmn-font');

console.log('copy diagram-js.css to ' + dest);
cp(resolve('diagram-js', '/assets/**'), dest + '/assets');

console.log('copy dmn-js-drd assets to ' + dest);
cp(resolve('dmn-js-drd', '/assets/css/**'), dest + '/assets');

console.log('copy dmn-js-decision-table assets to ' + dest);
cp(resolve('dmn-js-decision-table', '/assets/css/**'), dest + '/assets');

console.log('copy dmn-js-literal-expression assets to ' + dest);
cp(resolve('dmn-js-literal-expression', '/assets/css/**'), dest + '/assets');


var NODE_ENV = process.env.NODE_ENV;

[ 'production', 'development' ].forEach(function(env) {

  try {
    process.env.NODE_ENV = env;

    exec('webpack');
  } catch (e) {
    console.error(e);
  }

  process.env.NODE_ENV = NODE_ENV;
});