'use strict';

var isFunction = require('lodash/lang/isFunction'),
    assign = require('lodash/object/assign');

var TestContainer = require('mocha-test-container-support');

var Modeler = require('../../../../lib/table/Modeler');

var OPTIONS, DMN_JS;

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
function bootstrapModeler(table, options, locals) {

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

    if (typeof table !== 'string') {
      options = table;
      locals = options;
      table = undefined;
    }

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

    // remove previous instance
    if (DMN_JS) {
      DMN_JS.destroy();
    }

    DMN_JS = new Modeler(_options);

    DMN_JS.importXML(table, done);

    return DMN_JS;
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

    if (!DMN_JS) {
      throw new Error('no bootstraped modeler, ensure you created it via #bootstrapModeler');
    }

    DMN_JS.invoke(fn);
  };
}

function injectAsync(doneFn) {
  return function(done) {
    var testFn = doneFn(done);

    inject(testFn)();
  };
}

module.exports.bootstrapTable = (window || global).bootstrapModeler = bootstrapModeler;
module.exports.inject = (window || global).inject = inject;
module.exports.injectAsync = (window || global).injectAsync = injectAsync;


module.exports.getDmnJS = function() {
  return DMN_JS;
};

function insertCSS(name, css) {
  if (document.querySelector('[data-css-file="' + name + '"]')) {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
  style.setAttribute('data-css-file', name);

  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}

module.exports.insertCSS = insertCSS;
