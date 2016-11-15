/**
 * The code in the <project-logo></project-logo> area
 * must not be changed.
 *
 * @see http://bpmn.io/license for more information.
 */
'use strict';

var assign = require('lodash/object/assign'),
    filter = require('lodash/collection/filter'),
    omit = require('lodash/object/omit'),
    isString = require('lodash/lang/isString'),
    isNumber = require('lodash/lang/isNumber');

var domify = require('min-dom/lib/domify'),
    domQuery = require('min-dom/lib/query'),
    domRemove = require('min-dom/lib/remove');

var Diagram = require('diagram-js'),
    DmnModdle = require('dmn-moddle');

var TableViewer = require('./table/Viewer');

var inherits = require('inherits');

var Importer = require('./import/Importer');

var is = require('./util/ModelUtil').is;

var innerSVG = require('tiny-svg/lib/innerSVG');

function noop() {}

function lengthOne(arr) {
  return arr && arr.length === 1;
}

function checkValidationError(err) {

  // check if we can help the user by indicating wrong DMN 1.1 xml
  // (in case he or the exporting tool did not get that right)

  var pattern = /unparsable content <([^>]+)> detected([\s\S]*)$/,
      match = pattern.exec(err.message);

  if (match) {
    err.message =
      'unparsable content <' + match[1] + '> detected; ' +
      'this may indicate an invalid DMN 1.1 diagram file' + match[2];
  }

  return err;
}

var DEFAULT_OPTIONS = {
  width: '100%',
  height: '100%',
  position: 'relative',
  container: 'body',
  loadDiagram: false,
  disableDrdInteraction: false
};


/**
 * Ensure the passed argument is a proper unit (defaulting to px)
 */
function ensureUnit(val) {
  return val + (isNumber(val) ? 'px' : '');
}

/**
 * A viewer for DMN 1.1 diagrams.
 *
 * Have a look at {@link NavigatedViewer} or {@link Modeler} for bundles that include
 * additional features.
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
 * var drdViewer = new Viewer({ additionalModules: [ extensionModule ] });
 * drdViewer.importXML(...);
 * ```
 *
 * @param {Object} [options] configuration options to pass to the viewer
 * @param {Object} [options.table] configuration options to pass to the table viewer
 * @param {DOMElement} [options.container] the container to render the viewer in, defaults to body.
 * @param {String|Number} [options.width] the width of the viewer
 * @param {String|Number} [options.height] the height of the viewer
 * @param {Object} [options.moddleExtensions] extension packages to provide
 * @param {Array<didi.Module>} [options.modules] a list of modules to override the default modules
 * @param {Array<didi.Module>} [options.additionalModules] a list of modules to use with the default modules
 */
function Viewer(options) {
  var TableEditor = TableViewer;

  options = assign({}, DEFAULT_OPTIONS ,options);

  this.moddle = this._createModdle(options);

  if (options.editor) {
    TableEditor = options.editor;
  }

  this.table = new TableEditor(assign({}, {
    container: options.container,
    moddle: this.moddle,
    loadDiagram: options.loadDiagram, // load the DRD diagram even if there's only one decision
    isDetached: true // we instanciate the table with a detached container
  }, options.table));

  this.container = this._createContainer(options);

  /* <project-logo> */

  addProjectLogo(this.container);

  /* </project-logo> */

  this._init(this.container, this.moddle, options);

  // setup decision drill down listener
  this.on('decision.open', function(context) {
    var decision = context.decision;

    this.showDecision(decision);
  }, this);
}

inherits(Viewer, Diagram);

module.exports = Viewer;

/**
 * Parse and render a DMN 1.1 diagram.
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
  var loadDiagram = this._loadDiagram;

  // done is optional
  done = done || noop;

  var self = this;

  var oldNm = 'xmlns="http://www.omg.org/spec/DMN/20151101/dmn11.xsd"';

  // LEGACY YEAH! - convert to correct namespace
  if (xml.indexOf(oldNm)) {
    xml = xml.replace(new RegExp(oldNm), 'xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd"');
  }

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
      var allWarnings = [].concat(parseWarnings, importWarnings || []),
          decisions;

      self._emit('import.done', { error: err, warnings: allWarnings });

      // if there is only one decision, switch to table view
      decisions = self.getDecisions();

      if (lengthOne(definitions.drgElements) &&
          lengthOne(decisions) &&
          loadDiagram === false) {
        self.showDecision(decisions[0]);
      } else {
        // set the DRD Editor as the current active editor
        self._activeEditor = self;
      }

      done(err, allWarnings);
    });
  });
};

/**
 * Export the currently displayed DMN 1.1 diagram as
 * a DMN 1.1 XML document.
 *
 * @param {Object} [options] export options
 * @param {Boolean} [options.format=false] output formated XML
 * @param {Boolean} [options.preamble=true] output preamble
 *
 * @param {Function} done invoked with (err, xml)
 */
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

/**
 * Export the currently displayed DMN 1.1 diagram as
 * an SVG image.
 *
 * @param {Object} [options]
 * @param {Function} done invoked with (err, svgStr)
 */
Viewer.prototype.saveSVG = function(options, done) {

  if (!done) {
    done = options;
    options = {};
  }

  var canvas = this.get('canvas');

  var contentNode = canvas.getDefaultLayer(),
      defsNode = domQuery('defs', canvas._svg);

  var contents = innerSVG(contentNode),
      defs = (defsNode && defsNode.outerHTML) || '';

  var bbox = contentNode.getBBox();

  var svg =
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<!-- created with dmn-js / http://bpmn.io -->\n' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
         'width="' + bbox.width + '" height="' + bbox.height + '" ' +
         'viewBox="' + bbox.x + ' ' + bbox.y + ' ' + bbox.width + ' ' + bbox.height + '" version="1.1">' +
      defs + contents +
    '</svg>';

  done(null, svg);
};

Viewer.prototype.importDefinitions = function(definitions, done) {
  // use try/catch to not swallow synchronous exceptions
  // that may be raised during model parsing
  try {

    if (this.definitions) {
      // clear existing rendered diagram
      this.clear();
    }

    // update definitions
    this.definitions = definitions;

    if (this.table) {
      this.table.definitions = definitions;
    }

    // perform graphical import
    Importer.importDRD(this, definitions, done);
  } catch (e) {
    // handle synchronous errors
    done(e);
  }
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

Viewer.prototype.attach = function(container, oldContainer) {
  var parent = this._parentContainer;

  if (oldContainer.parentElement === parent) {
    parent.removeChild(oldContainer);
  }

  parent.appendChild(container);
};

Viewer.prototype.getActiveEditor = function() {
  return this._activeEditor;
};

Viewer.prototype.showDecision = function(decision, attrs, done) {
  var table = this.table,
      self = this;

  if (typeof attrs === 'function') {
    done = attrs;
    attrs = {};
  }

  done = done || noop;

  this.attach(table.container, this.container);

  this._activeEditor = table;

  return table.showDecision(decision, function(err, warnings) {
    self._emit('view.switch', assign({ decision: decision }, attrs));

    done(err, warnings);
  });
};

Viewer.prototype.showDRD = function(attrs) {
  var decision = this.table.getCurrentDecision();

  attrs = attrs || {};

  this.attach(this.container, this.table.container);

  this._activeEditor = this;

  this._emit('view.switch', assign({ decision: decision }, attrs));
};

Viewer.prototype.getModules = function() {
  return this._modules;
};

/**
 * Destroy the viewer instance and remove all its
 * remainders from the document tree.
 */
Viewer.prototype.destroy = function() {

  // diagram destroy
  Diagram.prototype.destroy.call(this);

  // dom detach
  domRemove(this.container);
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


Viewer.prototype._init = function(container, moddle, options) {

  var baseModules = options.modules || this.getModules(),
      additionalModules = options.additionalModules || [],
      staticModules = [
        {
          drdjs: [ 'value', this ],
          moddle: [ 'value', moddle ]
        }
      ];

  var diagramModules = [].concat(staticModules, baseModules, additionalModules);

  var diagramOptions = assign(omit(options, 'additionalModules'), {
    canvas: assign({}, options.canvas, { container: container }),
    modules: diagramModules
  });


  // this allows forcing the diagram loading
  // useful in the case where there's one decision table
  // and we want to still render the diagram
  this._loadDiagram = options.loadDiagram;

  // invoke diagram constructor
  Diagram.call(this, diagramOptions);

  // Enabled DRD interaction -> setup table switch buttons
  if (options.disableDrdInteraction === false) {
    this._setupTableSwitchListeners(options);
  }
};

Viewer.prototype._setupTableSwitchListeners = function(options) {
  var table = this.table;

  var self = this;

  table.get('eventBus').on('controls.init', function(event) {

    event.controls.addControl('Show DRD', function() {
      self.showDRD({ fromTable: true });
    });
  });
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

  container = domify('<div class="dmn-diagram"></div>');

  assign(container.style, {
    width: ensureUnit(options.width),
    height: ensureUnit(options.height),
    position: options.position
  });

  parent.appendChild(container);

  return container;
};

Viewer.prototype._createModdle = function(options) {
  var moddleOptions = assign({}, this._moddleExtensions, options.moddleExtensions);

  return new DmnModdle(moddleOptions);
};


// modules the viewer is composed of
Viewer.prototype._modules = [
  require('./core'),
  require('diagram-js/lib/features/selection'),
  require('diagram-js/lib/features/overlays'),
  require('./features/rules'),
  require('./features/drill-down'),
  require('./features/definition-id/viewer')
];

// default moddle extensions the viewer is composed of
Viewer.prototype._moddleExtensions = {};

/* <project-logo> */

var PoweredBy = require('./util/PoweredByUtil'),
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
       'class="bjs-powered-by" ' +
       'title="Powered by bpmn.io" ' +
       'style="position: absolute; bottom: 15px; right: 15px; z-index: 100">' +
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
