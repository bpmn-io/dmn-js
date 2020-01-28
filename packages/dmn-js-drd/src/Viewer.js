/**
 * The code in the <project-logo></project-logo> area
 * must not be changed.
 *
 * @see http://bpmn.io/license for more information.
 */

import {
  domify,
  query as domQuery,
  remove as domRemove
} from 'min-dom';

import Diagram from 'diagram-js';

import inherits from 'inherits';

import {
  importDRD
} from './import/Importer';

import {
  innerSVG
} from 'tiny-svg';


/**
 * A viewer for DMN diagrams.
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
 * @param {Object} options configuration options to pass to the viewer
 * @param {DOMElement} [options.container]
 *        the container to render the viewer in, defaults to body
 * @param {Array<didi.Module>} [options.modules]
 *        a list of modules to override the default modules
 * @param {Array<didi.Module>} [options.additionalModules]
 *        a list of modules to use with the default modules
 */
export default function Viewer(options) {

  this._container = this._createContainer();

  /* <project-logo> */

  addProjectLogo(this._container);

  /* </project-logo> */

  this._init(this._container, options);
}

inherits(Viewer, Diagram);

/**
 * Export the currently displayed DMN diagram as
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

  /* eslint-disable max-len */
  var svg =
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<!-- created with dmn-js / http://bpmn.io -->\n' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
         'width="' + bbox.width + '" height="' + bbox.height + '" ' +
         'viewBox="' + bbox.x + ' ' + bbox.y + ' ' + bbox.width + ' ' + bbox.height + '" version="1.1">' +
      defs + contents +
    '</svg>';
  /* eslint-enable */

  done(null, svg);
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
  domRemove(this._container);
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


Viewer.prototype._init = function(container, options) {

  var {
    additionalModules,
    canvas,
    ...additionalOptions
  } = options;

  var baseModules = options.modules || this.getModules(),
      staticModules = [
        {
          drd: [ 'value', this ]
        }
      ];

  var modules = [
    ...staticModules,
    ...baseModules,
    ...(additionalModules || [])
  ];

  var diagramOptions = {
    ...additionalOptions,
    canvas: {
      ...canvas,
      container
    },
    modules
  };


  // invoke diagram constructor
  Diagram.call(this, diagramOptions);

  if (options && options.container) {
    this.attachTo(options.container);
  }
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

Viewer.prototype._createContainer = function() {
  return domify(
    '<div class="dmn-drd-container"></div>'
  );
};

Viewer.prototype.open = function(definitions, done) {

  var err;

  // use try/catch to not swallow synchronous exceptions
  // that may be raised during model parsing
  try {

    if (this._definitions) {

      // clear existing rendered diagram
      this.clear();
    }

    // update definitions
    this._definitions = definitions;

    // perform graphical import
    return importDRD(this, definitions, done);
  } catch (e) {
    err = e;
  }

  return done(err);
};

/**
 * Attach viewer to given parent node.
 *
 * @param  {Element} parentNode
 */
Viewer.prototype.attachTo = function(parentNode) {

  if (!parentNode) {
    throw new Error('parentNode required');
  }

  // ensure we detach from the
  // previous, old parent
  this.detach();

  var container = this._container;

  parentNode.appendChild(container);

  this._emit('attach', {});

  this.get('canvas').resized();
};

/**
 * Detach viewer from parent node, if attached.
 */
Viewer.prototype.detach = function() {

  var container = this._container,
      parentNode = container.parentNode;

  if (!parentNode) {
    return;
  }

  this._emit('detach', {});

  parentNode.removeChild(container);
};

import CoreModule from './core';
import TranslateModule from 'diagram-js/lib/i18n/translate';
import SelectionModule from 'diagram-js/lib/features/selection';
import OverlaysModule from 'diagram-js/lib/features/overlays';
import DefinitionPropertiesModule from './features/definition-properties/viewer';
import DrillDownModule from './features/drill-down';

Viewer.prototype._modules = [
  CoreModule,
  TranslateModule,
  SelectionModule,
  OverlaysModule,
  DefinitionPropertiesModule,
  DrillDownModule
];

/* <project-logo> */

import {
  BPMNIO_IMG,
  open as openPoweredBy
} from './util/PoweredByUtil';

import {
  event as domEvent
} from 'min-dom';

/**
 * Adds the project logo to the diagram container as
 * required by the bpmn.io license.
 *
 * @see http://bpmn.io/license
 *
 * @param {Element} container
 */
function addProjectLogo(container) {
  var img = BPMNIO_IMG;

  var linkMarkup =
    '<a href="http://bpmn.io" ' +
       'target="_blank" ' +
       'class="bjs-powered-by" ' +
       'title="Powered by bpmn.io" ' +
       'style="position: absolute; bottom: 15px; right: 15px; z-index: 100">' +
      img +
    '</a>';

  var linkElement = domify(linkMarkup);

  container.appendChild(linkElement);

  domEvent.bind(linkElement, 'click', function(event) {
    openPoweredBy();

    event.preventDefault();
  });
}

/* </project-logo> */
