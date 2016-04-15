'use strict';

var assign = require('lodash/object/assign'),
    omit = require('lodash/object/omit'),
    isString = require('lodash/lang/isString'),
    isNumber = require('lodash/lang/isNumber');

var domify = require('min-dom/lib/domify'),
    domQuery = require('min-dom/lib/query'),
    domRemove = require('min-dom/lib/remove');

var Table = require('table-js'),
    DmnModdle = require('dmn-moddle');

var IdSupport = require('dmn-moddle/lib/id-support'),
    Ids = require('ids');

var Importer = require('./import/Importer');

var ComboBox = require('table-js/lib/features/combo-box');


function initListeners(table, listeners) {
  var events = table.get('eventBus');

  listeners.forEach(function(l) {
    events.on(l.event, l.handler);
  });

  events.on('table.destroy', function() {
    if (ComboBox.prototype._openedDropdown) {
      ComboBox.prototype._openedDropdown._closeDropdown();
    }
  });
}

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
 * Ensure the passed argument is a proper unit (defaulting to px)
 */
function ensureUnit(val) {
  return val + (isNumber(val) ? 'px' : '');
}

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

  var parent = options.container;

  // support jquery element
  // unwrap it if passed
  if (parent.get) {
    parent = parent.get(0);
  }

  // support selector
  if (isString(parent)) {
    parent = domQuery(parent);
  }

  var container = this.container = domify('<div class="dmn-table"></div>');
  parent.appendChild(container);
}

Viewer.prototype.importXML = function(xml, done) {

  var self = this;

  this.moddle = this.createModdle();

  this.moddle.fromXML(xml, 'dmn:Definitions', function(err, definitions, context) {
    if (err) {
      err = checkValidationError(err);
      return done(err);
    }

    var parseWarnings = context.warnings;

    self.importDefinitions(definitions, function(err, importWarnings) {
      if (err) {
        return done(err);
      }

      done(null, parseWarnings.concat(importWarnings || []));
    });
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

Viewer.prototype.createModdle = function() {
  var moddle = new DmnModdle(this.options.moddleExtensions);

  IdSupport.extend(moddle, new Ids([ 32, 36, 1 ]));

  return moddle;
};

Viewer.prototype.get = function(name) {

  if (!this.table) {
    throw new Error('no table loaded');
  }

  return this.table.get(name);
};

Viewer.prototype.invoke = function(fn) {

  if (!this.table) {
    throw new Error('no table loaded');
  }

  return this.table.invoke(fn);
};

Viewer.prototype.importDefinitions = function(definitions, done) {

  // use try/catch to not swallow synchronous exceptions
  // that may be raised during model parsing
  try {
    if (this.table) {
      this.clear();
    }

    this.definitions = definitions;

    var table = this.table = this._createTable(this.options);

    this._init(table);

    Importer.importDmnTable(table, definitions, done);
  } catch (e) {
    done(e);
  }
};

Viewer.prototype._init = function(table) {
  initListeners(table, this.__listeners || []);
};

Viewer.prototype._createTable = function(options) {

  var modules = [].concat(options.modules || this.getModules(), options.additionalModules || []);

  // add self as an available service
  modules.unshift({
    dmnjs: [ 'value', this ],
    moddle: [ 'value', this.moddle ]
  });

  options = omit(options, 'additionalModules');

  options = assign(options, {
    sheet: {
      width: options.width,
      height: options.height,
      container: this.container
    },
    modules: modules
  });

  return new Table(options);
};


Viewer.prototype.getModules = function() {
  return this._modules;
};

/**
 * Remove all drawn elements from the viewer.
 *
 * After calling this method the viewer can still
 * be reused for opening another table.
 */
Viewer.prototype.clear = function() {
  var table = this.table;

  if (table) {
    table.destroy();
  }

  delete this.table;
};

/**
 * Destroy the viewer instance and remove all its remainders
 * from the document tree.
 */
Viewer.prototype.destroy = function() {
  // clear underlying diagram
  this.clear();

  // remove container
  domRemove(this.container);
};

/**
 * Register an event listener on the viewer
 *
 * @param {String} event
 * @param {Function} handler
 */
Viewer.prototype.on = function(event, handler) {
  var table = this.table,
      listeners = this.__listeners = this.__listeners || [];

  listeners.push({ event: event, handler: handler });

  if (table) {
    table.get('eventBus').on(event, handler);
  }
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
  require('./features/hide-tech-control'),
  require('./features/hit-policy'),
  require('table-js/lib/features/interaction-events'),
  require('table-js/lib/features/controls'),
  require('table-js/lib/features/complex-cell')
];

module.exports = Viewer;
