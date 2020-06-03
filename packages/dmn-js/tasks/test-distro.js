'use strict';

var exec = require('execa').sync;

var failures = 0;

function runTest(variant, env) {

  var NODE_ENV = process.env.NODE_ENV;

  process.env.VARIANT = variant;
  process.env.NODE_ENV = env;

  console.log('[TEST] ' + variant + '@' + env);

  try {
    exec('karma', [ 'start', 'test/distro/karma.conf.js' ]);
  } catch (e) {
    console.error('[TEST] FAILURE');
    console.error(e);

    failures++;
  } finally {
    process.env.NODE_ENV = NODE_ENV;
  }
}

function test() {

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