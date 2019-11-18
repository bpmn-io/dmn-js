import {
  assign,
  isFunction,
  forEach
} from 'min-dash';

import TestContainer from 'mocha-test-container-support';

import LiteralExpressionViewer from './LiteralExpressionViewer';
import LiteralExpressionEditor from './LiteralExpressionEditor';

var OPTIONS, DMN_JS;


/**
 * Bootstrap the modeler given the specified options and a
 * number of locals (i.e. services)
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
 * @param  {Object} [options] optional options to be passed to the
 *                            diagram upon instantiation
 * @param  {Object|Function}  locals  the local overrides to be used
 *                            by the diagram or a function that produces
 *                            them
 * @return {Function}         a function to be passed to beforeEach
 */
function bootstrapDmnJS(DmnJS, diagram, options, locals) {

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

    if (typeof diagram !== 'string') {
      options = diagram;
      locals = options;
      diagram = undefined;
    }

    var _options = options,
        _locals = locals,
        _modules;

    if (!_locals && isFunction(_options)) {
      _locals = _options;
      _options = {};
    }

    if (isFunction(_options)) {
      _options = _options();
    }

    if (isFunction(_locals)) {
      _locals = _locals();
    }

    _modules = (_options || {})._modules || [];

    if (_locals) {
      var mockModule = {};

      forEach(_locals, function(v, k) {
        mockModule[k] = ['value', v];
      });

      _modules = [].concat(_modules, [ mockModule ]);
    }

    if (_modules.length === 0) {
      _modules = undefined;
    }

    _options = {
      container: testContainer,
      literalExpression: assign({
        modules: _modules || undefined
      }, OPTIONS || {}, _options || {})
    };

    // remove previous instance
    if (DMN_JS) {
      DMN_JS.destroy();
    }

    DMN_JS = new DmnJS(_options);

    DMN_JS.importXML(diagram, done);

    return DMN_JS;
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
export function inject(fn) {
  return function() {

    if (!DMN_JS) {
      throw new Error(
        'no bootstraped viewer, ' +
        'ensure you created it via #bootstrapViewer'
      );
    }

    var view = getLiteralExpression();

    if (!view) {
      throw new Error('DecisionTable instance not found');
    }

    view.invoke(fn);
  };
}

export function injectAsync(doneFn) {
  return function(done) {
    var testFn = doneFn(done);

    inject(testFn)();
  };
}

/**
 * Bootstrap the Modeler given the specified options
 * and a number of locals (i.e. services)
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
 * @param  {Object} (options) optional options to be passed
 *                            to the diagram upon instantiation
 * @param  {Object|Function} locals the local overrides to be
 *                           used by the diagram or a function
 *                           that produces them
 *
 * @return {Function} a function to be passed to beforeEach
 */
export function bootstrapModeler(diagram, options, locals) {
  return bootstrapDmnJS(LiteralExpressionEditor, diagram, options, locals);
}

/**
 * Bootstrap the Viewer given the specified options and
 * a number of locals (i.e. services)
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
 * @param  {Object} [options] optional options to be
 *                  passed to the diagram upon instantiation
 * @param  {Object|Function} locals the local overrides to be
 *                  used by the diagram or a function that produces them
 *
 * @return {Function} a function to be passed to beforeEach
 */
export function bootstrapViewer(diagram, options, locals) {
  return bootstrapDmnJS(LiteralExpressionViewer, diagram, options, locals);
}

export function getDmnJS() {
  return DMN_JS;
}

export function getLiteralExpression() {
  return DMN_JS.getActiveViewer();
}

export function insertCSS(name, css) {
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