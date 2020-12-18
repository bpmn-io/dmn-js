import {
  assign
} from 'min-dash';


/**
 * A palette provider for DMN elements.
 */
export default function PaletteProvider(
    palette, create, elementFactory,
    handTool, lassoTool, translate) {

  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._handTool = handTool;
  this._lassoTool = lassoTool;
  this._translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'handTool',
  'lassoTool',
  'translate'
];


PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions = {},
      create = this._create,
      elementFactory = this._elementFactory,
      handTool = this._handTool,
      lassoTool = this._lassoTool,
      translate = this._translate;

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
    'hand-tool': {
      group: 'tools',
      className: 'dmn-icon-hand-tool',
      title: translate('Activate the hand tool'),
      action: {
        click: function(event) {
          handTool.activateHand(event);
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'dmn-icon-lasso-tool',
      title: translate('Activate the lasso tool'),
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
      'dmn:Decision', 'drd', 'dmn-icon-decision', translate('Create Decision')
    ),
    'create.input-data': createAction(
      'dmn:InputData', 'drd', 'dmn-icon-input-data', translate('Create Input Data')
    ),
    'create.knowledge-source': createAction(
      'dmn:KnowledgeSource', 'drd', 'dmn-icon-knowledge-source',
      translate('Create Knowledge Source')
    ),
    'create.business-knowledge-model': createAction(
      'dmn:BusinessKnowledgeModel', 'drd', 'dmn-icon-business-knowledge',
      translate('Create Knowledge Model')
    )
  });

  return actions;
};
