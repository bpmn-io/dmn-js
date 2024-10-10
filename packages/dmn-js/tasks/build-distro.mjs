import path from 'node:path';
import fs from 'node:fs';

import cp from 'cpy';
import { deleteAsync as del } from 'del';

import { execa as exec } from 'execa';

import { createRequire } from 'node:module';

var dest = process.env.DISTRO_DIST || 'dist';

function resolve(module, sub) {
  var require = createRequire(import.meta.url);
  var pkg = require.resolve(module + '/package.json');

  return path.dirname(pkg) + sub;
}

async function run() {

  console.log('clean ' + dest);
  await del(dest);

  console.log('mkdir -p ' + dest);
  fs.mkdirSync(dest, { recursive: true });

  console.log('copy dmn-font to ' + dest + '/dmn-font');
  await cp(resolve('dmn-font', '/dist/css/**'), dest + '/assets/dmn-font/css');
  await cp(resolve('dmn-font', '/dist/font/**'), dest + '/assets/dmn-font/font');

  console.log('copy diagram-js.css to ' + dest);
  await cp(resolve('diagram-js', '/assets/**'), dest + '/assets');

  console.log('copy bpmn-js.css to ' + dest);
  await cp('./assets/*.css', dest + '/assets');

  console.log('copy dmn-js-shared assets to ' + dest);
  await cp(resolve('dmn-js-shared', '/assets/css/**'), dest + '/assets');

  console.log('copy dmn-js-drd assets to ' + dest);
  await cp(resolve('dmn-js-drd', '/assets/css/**'), dest + '/assets');

  console.log('copy dmn-js-decision-table assets to ' + dest);
  await cp(resolve('dmn-js-decision-table', '/assets/css/**'), dest + '/assets');

  console.log('copy dmn-js-literal-expression assets to ' + dest);
  await cp(resolve('dmn-js-literal-expression', '/assets/css/**'), dest + '/assets');

  console.log('copy dmn-js-boxed-expression assets to ' + dest);
  await cp(resolve('dmn-js-boxed-expression', '/assets/css/**'), dest + '/assets');

  console.log('building pre-packaged distributions');

  var NODE_ENV = process.env.NODE_ENV;

  try {
    for (const env of [ 'production', 'development' ]) {

      process.env.NODE_ENV = env;

      await exec('rollup', [ '-c', '--bundleConfigAsCjs' ], {
        stdio: 'inherit'
      });
    }
  } finally {
    process.env.NODE_ENV = NODE_ENV;
  }

  console.log('done.');
}

run().catch(e => {
  console.error('failed to build distribution', e);

  process.exit(1);
});