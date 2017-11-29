'use strict';

var inherits = require('inherits');

var Viewer = require('./Viewer');

import forEach from 'lodash/collection/forEach';

import { containsDi } from 'dmn-js-shared/lib/util/DiUtil';
import { is } from 'dmn-js-shared/lib/util/ModelUtil';

var initialTemplate = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<definitions xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd"',
  'id="definitions"',
  'name="definitions"',
  'namespace="http://camunda.org/schema/1.0/dmn">',
  '<decision id="decision" name="">',
  '<decisionTable id="decisionTable">',
  '<input id="input1" label="">',
  '<inputExpression id="inputExpression1" typeRef="string">',
  '<text></text>',
  '</inputExpression>',
  '</input>',
  '<output id="output1" label="" name="" typeRef="string">',
  '</output>',
  '</decisionTable>',
  '</decision>',
  '</definitions>'
].join('\n');

/**
 * A modeler for DMN tables.
 *
 *
 * ## Extending the Modeler
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
 * var dmnModeler = new Modeler({ additionalModules: [ extensionModule ] });
 * dmnModeler.importXML(...);
 * ```
 *
 *
 * ## Customizing / Replacing Components
 *
 * You can replace individual table components by redefining them in override modules.
 * This works for all components, including those defined in the core.
 *
 * Pass in override modules via the `options.additionalModules` flag like this:
 *
 * ```javascript
 * function CustomContextPadProvider(contextPad) {
 *
 *   contextPad.registerProvider(this);
 *
 *   this.getContextPadEntries = function(element) {
 *     // no entries, effectively disable the context pad
 *     return {};
 *   };
 * }
 *
 * CustomContextPadProvider.$inject = [ 'contextPad' ];
 *
 * var overrideModule = {
 *   contextPadProvider: [ 'type', CustomContextPadProvider ]
 * };
 *
 * var dmnModeler = new Modeler({ additionalModules: [ overrideModule ]});
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
function Modeler(options) {
  Viewer.call(this, options);

  // ensure the definitions contains DI information
  this.on('import.start', ({ definitions }) => {
    if (!containsDi(definitions)) {
      this._createDi(definitions);
    }
  });
}

inherits(Modeler, Viewer);

module.exports = Modeler;


Modeler.prototype.createTemplate = function(done) {
  this.importXML(initialTemplate, done);
};

Modeler.prototype._createDi = function(definitions) {

  var drdFactory = this.get('drdFactory'),
      elementFactory = this.get('elementFactory');

  var idx = 0;

  forEach(definitions.drgElements, function(element) {

    var bounds,
        extensionElements,
        dimensions;

    // only create DI for decision elements;
    // we're not a full fledged layouter (!)
    if (!is(element, 'dmn:Decision')) {
      return;
    }

    extensionElements = element.extensionElements;

    if (!extensionElements) {
      extensionElements = element.extensionElements = drdFactory.createDi();
      extensionElements.$parent = element;
    }

    dimensions = elementFactory._getDefaultSize(element);

    bounds = drdFactory.createDiBounds({
      x: 150 + (idx * 30),
      y: 150 + (idx * 30),
      width: dimensions.width,
      height: dimensions.height
    });

    // add bounds
    extensionElements.get('values').push(bounds);
    bounds.$parent = extensionElements;

    // stacking elements nicely on top of each other
    idx++;
  });

};

// modules the modeler is composed of
//
// - viewer modules
// - interaction modules
// - modeling modules

Modeler.prototype._interactionModules = [
  // non-modeling components
  require('diagram-js/lib/navigation/movecanvas'),
  require('diagram-js/lib/navigation/touch'),
  require('diagram-js/lib/navigation/zoomscroll')
];

Modeler.prototype._modelingModules = [
  // modeling components
  require('diagram-js/lib/features/move'),
  require('diagram-js/lib/features/bendpoints'),
  require('diagram-js/lib/features/overlays'),
  require('./features/editor-actions'),
  require('./features/context-pad'),
  require('./features/keyboard'),
  require('./features/label-editing'),
  require('./features/modeling'),
  require('./features/palette'),
  require('./features/definition-properties/modeler')
];

Modeler.prototype._modules = [].concat(
  Modeler.prototype._modules,
  Modeler.prototype._interactionModules,
  Modeler.prototype._modelingModules);
