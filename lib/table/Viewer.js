/**
 * The code in the <project-logo></project-logo> area
 * must not be changed.
 *
 * @see http://bpmn.io/license for more information.
 */
'use strict';

var assign = require('lodash/object/assign'),
    omit = require('lodash/object/omit'),
    isString = require('lodash/lang/isString'),
    filter = require('lodash/collection/filter');

var domify = require('min-dom/lib/domify'),
    domQuery = require('min-dom/lib/query'),
    domRemove = require('min-dom/lib/remove');

var Table = require('table-js'),
    DmnModdle = require('dmn-moddle');

var inherits = require('inherits');

var Importer = require('./import/Importer');

var is = require('../util/ModelUtil').is;

var ComboBox = require('table-js/lib/features/combo-box');


function checkValidationError(err) {

  // check if we can help the user by indicating wrong DMN xml
  // (in case he or the exporting tool did not get that right)

  var pattern = /unparsable content <([^>]+)> detected([\s\S]*)$/;
  var match = pattern.exec(err.message);

  if (match) {
    err.message =
      'unparsable content <' + match[1] + '> detected; ' +
      'this may indicate an invalid DMN file' + match[2];
  }

  return err;
}

var DEFAULT_OPTIONS = {
  container: 'body'
};

/**
 * A viewer for DMN tables.
 *
 *
 * ## Extending the Viewer
 *
 * In order to extend the viewer pass extension modules to bootstrap via the
 * `additionalModules` option. An extension module is an object that exposes
 * named services.
 *
 * The following example depicts the integration of a simple
 * logging component that integrates with interaction events:
 *
 *
 * ```javascript
 *
 * // logging component
 * function InteractionLogger(eventBus) {
 *   eventBus.on('element.hover', function(event) {
 *     console.log()
 *   })
 * }
 *
 * InteractionLogger.$inject = [ 'eventBus' ]; // minification save
 *
 * // extension module
 * var extensionModule = {
 *   __init__: [ 'interactionLogger' ],
 *   interactionLogger: [ 'type', InteractionLogger ]
 * };
 *
 * // extend the viewer
 * var dmnViewer = new Viewer({ additionalModules: [ extensionModule ] });
 * dmnViewer.importXML(...);
 * ```
 *
 * @param {Object} [options] configuration options to pass to the viewer
 * @param {DOMElement} [options.container] the container to render the viewer in, defaults to body.
 * @param {String|Number} [options.width] the width of the viewer
 * @param {String|Number} [options.height] the height of the viewer
 * @param {Object} [options.moddleExtensions] extension packages to provide
 * @param {Array<didi.Module>} [options.modules] a list of modules to override the default modules
 * @param {Array<didi.Module>} [options.additionalModules] a list of modules to use with the default modules
 */
function Viewer(options) {

  this.options = options = assign({}, DEFAULT_OPTIONS, options || {});

  this.moddle = options.moddle;

  if (!this.moddle) {
    this.moddle = this._createModdle(options);
  }

  this.container = this._createContainer(options);

  this._init(this.container, this.moddle, options);

  /* <project-logo> */

  addProjectLogo(this.container.firstChild);

  /* </project-logo> */

  this.on([ 'table.destroy', 'table.clear' ], function() {
    if (ComboBox.prototype._openedDropdown) {
      ComboBox.prototype._openedDropdown._closeDropdown();
    }
  }, this);
}

inherits(Viewer, Table);

module.exports = Viewer;

/**
 * Parse and render a DMN 1.1 table.
 *
 * Once finished the viewer reports back the result to the
 * provided callback function with (err, warnings).
 *
 * ## Life-Cycle Events
 *
 * During import the viewer will fire life-cycle events:
 *
 *   * import.parse.start (about to read model from xml)
 *   * import.parse.complete (model read; may have worked or not)
 *   * import.render.start (graphical import start)
 *   * import.render.complete (graphical import finished)
 *   * import.done (everything done)
 *
 * You can use these events to hook into the life-cycle.
 *
 * @param {String} xml the DMN 1.1 xml
 * @param {Function} [done] invoked with (err, warnings=[])
 */
Viewer.prototype.importXML = function(xml, done) {

  // done is optional
  done = done || function() {};

  var self = this;

  // hook in pre-parse listeners +
  // allow xml manipulation
  xml = this._emit('import.parse.start', { xml: xml }) || xml;

  this.moddle.fromXML(xml, 'dmn:Definitions', function(err, definitions, context) {

    // hook in post parse listeners +
    // allow definitions manipulation
    definitions = self._emit('import.parse.complete', {
      error: err,
      definitions: definitions,
      context: context
    }) || definitions;

    if (err) {
      err = checkValidationError(err);

      self._emit('import.done', { error: err });

      return done(err);
    }

    var parseWarnings = context.warnings;

    self.importDefinitions(definitions, function(err, importWarnings) {
      var allWarnings = [].concat(parseWarnings, importWarnings || []);

      self._emit('import.done', { error: err, warnings: allWarnings });

      done(err, allWarnings);
    });
  });
};

Viewer.prototype.getDefinitions = function() {
  return this.definitions;
};

Viewer.prototype.getDecisions = function(definitions) {
  var defs = definitions || this.definitions;

  if (!defs) {
    return;
  }

  return filter(defs.drgElements, function(element) {
    return is(element, 'dmn:Decision');
  });
};

Viewer.prototype.getCurrentDecision = function() {
  return this._decision;
};

Viewer.prototype.showDecision = function(decision, done) {
  var self = this;

  if (!this.definitions) {
    throw new Error('Definitions not parsed yet');
  }

  if (!decision) {
    throw new Error('Unknown decision object');
  }

  if (!done) {
    done = function() {};
  }

  // so we can get it later from the DRD Viewer
  this._decision = decision;

  // import the definition with the given decision
  this.importDefinitions(this.definitions, decision, function(err, importWarnings) {
    var warnings = importWarnings || [];

    self._emit('import.done', { error: err, warnings: warnings });

    done(err, warnings);
  });

};

Viewer.prototype.saveXML = function(options, done) {

  if (!done) {
    done = options;
    options = {};
  }

  var definitions = this.definitions;

  if (!definitions) {
    return done(new Error('no definitions loaded'));
  }

  this.moddle.toXML(definitions, options, done);
};

Viewer.prototype.importDefinitions = function(definitions, decision, done) {
  var decisions;

  // use try/catch to not swallow synchronous exceptions
  // that may be raised during model parsing
  try {
    if (this.definitions) {
      this.clear();
    }

    if (typeof decision === 'function') {
      done = decision;
      decisions = this.getDecisions(definitions);

      decision = decisions && decisions[0];
    }

    this.definitions = definitions;

    // perform graphical import
    Importer.importDmnTable(this, definitions, decision, done);
  } catch (e) {
    done(e);
  }
};

Viewer.prototype._createContainer = function(options) {

  var parent = options.container,
      container;

  // support jquery element
  // unwrap it if passed
  if (parent.get) {
    parent = parent.get(0);
  }

  // support selector
  if (isString(parent)) {
    parent = domQuery(parent);
  }

  this._parentContainer = parent;

  container = domify('<div class="dmn-table"></div>');

  // append to DOM unless explicity defined otherwise
  if (options.isDetached !== true) {
    parent.appendChild(container);
  }

  return container;
};

/**
 * Create a moddle instance.
 *
 * @param {Object} options
 */
Viewer.prototype._createModdle = function(options) {
  var moddleOptions = assign({}, this._moddleExtensions, options.moddleExtensions);

  return new DmnModdle(moddleOptions);
};

Viewer.prototype._init = function(container, moddle, options) {

  var modules = [].concat(options.modules || this.getModules(), options.additionalModules || []);

  // add self as an available service
  modules.unshift({
    dmnjs: [ 'value', this ],
    moddle: [ 'value', moddle ]
  });

  options = omit(options, 'additionalModules');

  options = assign(options, {
    sheet: {
      width: options.width,
      height: options.height,
      container: container
    },
    modules: modules
  });

  // invoke table constructor
  Table.call(this, options);
};


Viewer.prototype.getModules = function() {
  return this._modules;
};


/**
 * Destroy the viewer instance and remove all its
 * remainders from the document tree.
 */
Viewer.prototype.destroy = function() {

  // table destroy
  Table.prototype.destroy.call(this);

  // dom detach
  domRemove(this.container);
};

/**
 * Emit an event on the underlying {@link EventBus}
 *
 * @param  {String} type
 * @param  {Object} event
 *
 * @return {Object} event processing result (if any)
 */
Viewer.prototype._emit = function(type, event) {
  return this.get('eventBus').fire(type, event);
};

/**
 * Register an event listener
 *
 * Remove a previously added listener via {@link #off(event, callback)}.
 *
 * @param {String} event
 * @param {Number} [priority]
 * @param {Function} callback
 * @param {Object} [that]
 */
Viewer.prototype.on = function(event, priority, callback, target) {
  return this.get('eventBus').on(event, priority, callback, target);
};

/**
 * De-register an event listener
 *
 * @param {String} event
 * @param {Function} callback
 */
Viewer.prototype.off = function(event, callback) {
  this.get('eventBus').off(event, callback);
};

// modules the viewer is composed of
Viewer.prototype._modules = [
  require('./core'),
  require('table-js/lib/features/line-numbers'),
  require('./features/io-label'),
  require('./features/table-name'),
  require('./features/annotations'),
  require('./features/mappings-row'),
  require('./features/type-row'),
  require('./features/simple-mode'),
  require('./features/hit-policy'),
  require('./features/descriptions'),
  require('./features/date-edit/viewer'),
  require('./features/string-edit/viewer'),
  require('./features/literal-expression'),

  require('table-js/lib/features/interaction-events'),
  require('table-js/lib/features/controls'),
  require('table-js/lib/features/complex-cell')
];


/* <project-logo> */

var PoweredBy = require('./../util/PoweredByUtil'),
    domEvent = require('min-dom/lib/event');

/**
 * Adds the project logo to the diagram container as
 * required by the bpmn.io license.
 *
 * @see http://bpmn.io/license
 *
 * @param {Element} container
 */
function addProjectLogo(container) {
  var logoData = PoweredBy.BPMNIO_LOGO;

  var linkMarkup =
    '<a href="http://bpmn.io" ' +
       'target="_blank" ' +
       'class="dmn-js-powered-by" ' +
       'title="Powered by bpmn.io" ' +
       'style="position: absolute; z-index: 100">' +
        '<img src="data:image/png;base64,' + logoData + '">' +
    '</a>';

  var linkElement = domify(linkMarkup);

  container.appendChild(linkElement);

  domEvent.bind(linkElement, 'click', function(event) {
    PoweredBy.open();

    event.preventDefault();
  });
}

/* </project-logo> */
