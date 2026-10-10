import { execaSync as exec } from 'execa';

import { existsSync, readFileSync } from 'node:fs';

var failures = 0;

function verifyAssets() {
  const assetPaths = [
    'dist/assets/diagram-js.css',
    'dist/assets/dmn-js-boxed-expression-controls.css',
    'dist/assets/dmn-js-boxed-expression.css',
    'dist/assets/dmn-js-drd.css',
    'dist/assets/dmn-js-shared.css',
    'dist/assets/dmn-font/css/dmn.css'
  ];

  for (const assetPath of assetPaths) {

    if (!existsSync(assetPath)) {
      console.error(`expected file <${assetPath}> does not exist!`);

      failures++;
    }
  }
}


function verifyProductionBundles() {
  const variants = [
    'dmn-modeler',
    'dmn-navigated-viewer',
    'dmn-viewer'
  ];

  for (const variant of variants) {
    const bundlePath = `dist/${variant}.production.min.js`;

    if (readFileSync(bundlePath, 'utf8').includes('Inferno is in development mode')) {
      console.error(`expected <${bundlePath}> to bundle the production build of Inferno!`);

      failures++;
    }
  }
}


function runTest(variant, env) {

  var NODE_ENV = process.env.NODE_ENV;

  process.env.VARIANT = variant;
  process.env.NODE_ENV = env;

  console.log('[TEST] ' + variant + '@' + env);

  try {
    exec('karma', [ 'start', 'test/distro/karma.conf.js' ], {
      stdio: 'inherit'
    });
  } catch (e) {
    console.error('[TEST] FAILURE');
    console.error(e);

    failures++;
  } finally {
    process.env.NODE_ENV = NODE_ENV;
  }
}

function test() {

  verifyAssets();
  verifyProductionBundles();

  runTest('dmn-modeler', 'development');
  runTest('dmn-modeler', 'production');

  runTest('dmn-navigated-viewer', 'development');
  runTest('dmn-navigated-viewer', 'production');

  runTest('dmn-viewer', 'development');
  runTest('dmn-viewer', 'production');

  if (failures) {
    process.exit(1);
  }
}


test();