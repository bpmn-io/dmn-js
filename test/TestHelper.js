'use strict';

var unique = require('lodash/array/unique'),
    isFunction = require('lodash/lang/isFunction'),
    assign = require('lodash/object/assign'),
    forEach = require('lodash/collection/forEach');

var TestContainer = require('mocha-test-container-support');

var Modeler = require('../lib/Modeler');

var fs = require('fs');

var OPTIONS, MODELER;

// bind polyfill for PhantomJS
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP ? this : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // native functions don't have a prototype
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}


/**
 * Bootstrap the modeler given the specified options and a number of locals (i.e. services)
 *
 * @example
 *
 * describe(function() {
 *
 *   var mockEvents;
 *
 *   beforeEach(bootstrapTable(function() {
 *     mockEvents = new Events();
 *
 *     return {
 *       events: mockEvents
 *     };
 *   }));
 *
 * });
 *
 * @param  {Object} (options) optional options to be passed to the table upon instantiation
 * @param  {Object|Function} locals  the local overrides to be used by the table or a function that produces them
 * @return {Function}         a function to be passed to beforeEach
 */
function bootstrapModeler(options, locals) {

  return function(done) {

    var testContainer;


    // Make sure the test container is an optional dependency and we fall back
    // to an empty <div> if it does not exist.
    //
    // This is needed if other libraries rely on this helper for testing
    // while not adding the mocha-test-container-support as a dependency.
    try {
      testContainer = TestContainer.get(this);
    } catch (e) {
      testContainer = document.createElement('div');
      document.body.appendChild(testContainer);
    }

    testContainer.classList.add('test-container');


    var _options = options,
        _locals = locals;

    if (!_locals && isFunction(_options)) {
      _locals = _options;
      _options = null;
    }

    if (isFunction(_options)) {
      _options = _options();
    }

    if (isFunction(_locals)) {
      _locals = _locals();
    }

    _options = assign({ container: testContainer }, OPTIONS || {}, _options || {});

    MODELER = new Modeler(_options);

    MODELER.importXML(fs.readFileSync(__dirname + '/fixtures/dmn/new-table.dmn', 'utf-8'), function(){ done(); });

    return MODELER;
  };
}

/**
 * Injects services of an instantiated table into the argument.
 *
 * Use it in conjunction with {@link #bootstrapTable}.
 *
 * @example
 *
 * describe(function() {
 *
 *   var mockEvents;
 *
 *   beforeEach(bootstrapTable(...));
 *
 *   it('should provide mocked events', inject(function(events) {
 *     expect(events).toBe(mockEvents);
 *   }));
 *
 * });
 *
 * @param  {Function} fn the function to inject to
 * @return {Function} a function that can be passed to it to carry out the injection
 */
function inject(fn) {
  return function() {

    if (!MODELER) {
      throw new Error('no bootstraped modeler, ensure you created it via #bootstrapModeler');
    }

    MODELER.invoke(fn);
  };
}


module.exports.bootstrapTable = (window || global).bootstrapModeler = bootstrapModeler;
module.exports.inject = (window || global).inject = inject;
