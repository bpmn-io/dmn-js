'use strict';

var unique = require('lodash/array/unique'),
    assign = require('lodash/object/assign'),
    isFunction = require('lodash/lang/isFunction'),
    forEach = require('lodash/collection/forEach');

var TestContainer = require('mocha-test-container-support');

var Viewer = require('../../../lib/Viewer'),
    Modeler = require('../../../lib/Modeler');

var OPTIONS, DRD_JS;

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
 *   beforeEach(bootstrapDiagram(function() {
 *     mockEvents = new Events();
 *
 *     return {
 *       events: mockEvents
 *     };
 *   }));
 *
 * });
 *
 * @param  {Object} (options) optional options to be passed to the diagram upon instantiation
 * @param  {Object|Function} locals  the local overrides to be used by the diagram or a function that produces them
 * @return {Function}         a function to be passed to beforeEach
 */
function bootstrapDrdJS(DrdJS, diagram, options, locals) {

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

    if (typeof diagram !== 'string') {
      options = diagram;
      locals = options;
      diagram = undefined;
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

    if (_locals) {
      var mockModule = {};

      forEach(_locals, function(v, k) {
        mockModule[k] = ['value', v];
      });

      _options.modules = [].concat(_options.modules || [], [ mockModule ]);
    }

    _options.modules = unique(_options.modules);

    if (!_options.modules.length) {
      _options.modules = undefined;
    }

    // remove previous instance
    if (DRD_JS) {
      DRD_JS.destroy();
    }

    DRD_JS = new DrdJS(_options);

    DRD_JS.importXML(diagram, done);

    return DRD_JS;
  };
}

/**
 * Injects services of an instantiated diagram into the argument.
 *
 * Use it in conjunction with {@link #bootstrapViewer}.
 *
 * @example
 *
 * describe(function() {
 *
 *   var mockEvents;
 *
 *   beforeEach(bootstrapViewer(...));
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

    if (!DRD_JS) {
      throw new Error('no bootstraped viewer, ensure you created it via #bootstrapViewer');
    }

    DRD_JS.invoke(fn);
  };
}

function injectAsync(doneFn) {
  return function(done) {
    var testFn = doneFn(done);

    inject(testFn)();
  };
}

/**
 * Bootstrap the Modeler given the specified options and a number of locals (i.e. services)
 *
 * @example
 *
 * describe(function() {
 *
 *   var mockEvents;
 *
 *   beforeEach(bootstrapModeler('some-xml', function() {
 *     mockEvents = new Events();
 *
 *     return {
 *       events: mockEvents
 *     };
 *   }));
 *
 * });
 *
 * @param  {String} xml document to display
 * @param  {Object} (options) optional options to be passed to the diagram upon instantiation
 * @param  {Object|Function} locals  the local overrides to be used by the diagram or a function that produces them
 * @return {Function}         a function to be passed to beforeEach
 */
function bootstrapModeler(diagram, options, locals) {
  return bootstrapDrdJS(Modeler, diagram, options, locals);
}

/**
 * Bootstrap the Viewer given the specified options and a number of locals (i.e. services)
 *
 * @example
 *
 * describe(function() {
 *
 *   var mockEvents;
 *
 *   beforeEach(bootstrapViewer('some-xml', function() {
 *     mockEvents = new Events();
 *
 *     return {
 *       events: mockEvents
 *     };
 *   }));
 *
 * });
 *
 * @param  {String} xml document to display
 * @param  {Object} (options) optional options to be passed to the diagram upon instantiation
 * @param  {Object|Function} locals  the local overrides to be used by the diagram or a function that produces them
 * @return {Function}         a function to be passed to beforeEach
 */
function bootstrapViewer(diagram, options, locals) {
  return bootstrapDrdJS(Viewer, diagram, options, locals);
}


module.exports.bootstrapDrdJS = (window || global).bootstrapDrdJS = bootstrapDrdJS;
module.exports.bootstrapModeler = (window || global).bootstrapModeler = bootstrapModeler;
module.exports.bootstrapViewer = (window || global).bootstrapViewer = bootstrapViewer;
module.exports.inject = (window || global).inject = inject;
module.exports.injectAsync = (window || global).injectAsync = injectAsync;


module.exports.getDrdJS = function() {
  return DRD_JS;
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
