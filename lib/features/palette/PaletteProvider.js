'use strict';

var assign = require('lodash/object/assign');

/**
 * A palette provider for DMN 1.1 elements.
 */
function PaletteProvider(palette, create, elementFactory, lassoTool) {

  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._lassoTool = lassoTool;

  palette.registerProvider(this);
}

module.exports = PaletteProvider;

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'lassoTool'
];


PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions  = {},
      create = this._create,
      elementFactory = this._elementFactory,
      lassoTool = this._lassoTool;

  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      create.start(event, shape);
    }

    return {
      group: group,
      className: className,
      title: title,
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  assign(actions, {
    'lasso-tool': {
      group: 'tools',
      className: 'dmn-icon-lasso-tool',
      title: 'Activate the lasso tool',
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.decision': createAction(
      'dmn:Decision', 'drd', 'dmn-icon-decision'
    ),
    'create.input-data': createAction(
      'dmn:InputData', 'drd', 'dmn-icon-input-data'
    ),
    'create.knowledge-source': createAction(
      'dmn:KnowledgeSource', 'drd', 'dmn-icon-knowledge-source'
    ),
    'create.business-knowledge-model': createAction(
      'dmn:BusinessKnowledgeModel', 'drd', 'dmn-icon-business-knowledge'
    )
  });

  return actions;
};
