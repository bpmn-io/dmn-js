import path from 'node:path';
import fs from 'node:fs';

import { copySync as cp } from 'cpx';
import { sync as del } from 'del';
import { execaSync as exec } from 'execa';

import { createRequire } from 'node:module';

var dest = process.env.DISTRO_DIST || 'dist';

function resolve(module, sub) {
  var require = createRequire(import.meta.url);
  var pkg = require.resolve(module + '/package.json');

  return path.dirname(pkg) + sub;
}

console.log('clean ' + dest);
del(dest);

console.log('mkdir -p ' + dest);
fs.mkdirSync(dest, { recursive: true });

console.log('copy dmn-font to ' + dest + '/dmn-font');
cp(resolve('dmn-font', '/dist/{font,css}/**'), dest + '/assets/dmn-font');

console.log('copy diagram-js.css to ' + dest);
cp(resolve('diagram-js', '/assets/**'), dest + '/assets');

console.log('copy dmn-js-shared assets to ' + dest);
cp(resolve('dmn-js-shared', '/assets/css/**'), dest + '/assets');

console.log('copy dmn-js-drd assets to ' + dest);
cp(resolve('dmn-js-drd', '/assets/css/**'), dest + '/assets');

console.log('copy dmn-js-decision-table assets to ' + dest);
cp(resolve('dmn-js-decision-table', '/assets/css/**'), dest + '/assets');

console.log('copy dmn-js-literal-expression assets to ' + dest);
cp(resolve('dmn-js-literal-expression', '/assets/css/**'), dest + '/assets');

console.log('building pre-packaged distributions');

var NODE_ENV = process.env.NODE_ENV;

[ 'production', 'development' ].forEach(function(env) {

  try {
    process.env.NODE_ENV = env;

    exec('rollup', [ '-c', '--bundleConfigAsCjs' ], {
      stdio: 'inherit'
    });
  } catch (e) {
    console.error('failed to build pre-package distributions', e);

    process.exit(1);
  }

  process.env.NODE_ENV = NODE_ENV;
});

console.log('done.');