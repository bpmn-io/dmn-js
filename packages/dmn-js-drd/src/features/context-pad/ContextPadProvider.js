import {
  assign,
  isArray
} from 'min-dash';

import {
  is,
  isAny
} from 'dmn-js-shared/lib/util/ModelUtil';

import {
  hasPrimaryModifier
} from 'diagram-js/lib/util/Mouse';


/**
* A provider for DMN elements context pad
*/
export default function ContextPadProvider(
    eventBus, contextPad, modeling,
    elementFactory, connect, create,
    rules, popupMenu, canvas,
    translate) {

  contextPad.registerProvider(this);

  this._contextPad = contextPad;

  this._modeling = modeling;

  this._elementFactory = elementFactory;
  this._connect = connect;
  this._create = create;
  this._rules = rules;
  this._popupMenu = popupMenu;
  this._canvas = canvas;
  this._translate = translate;


  eventBus.on('create.end', 250, function(event) {
    var shape = event.context.shape;

    if (!hasPrimaryModifier(event)) {
      return;
    }

    var entries = contextPad.getEntries(shape);

    if (entries.replace) {
      entries.replace.action.click(event, shape);
    }
  });
}

ContextPadProvider.$inject = [
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'rules',
  'popupMenu',
  'canvas',
  'translate'
];


ContextPadProvider.prototype.getContextPadEntries = function(element) {

  var modeling = this._modeling,

      elementFactory = this._elementFactory,
      connect = this._connect,
      create = this._create,
      popupMenu = this._popupMenu,
      canvas = this._canvas,
      contextPad = this._contextPad,
      rules = this._rules,
      translate = this._translate;

  var actions = {};

  if (element.type === 'label') {
    return actions;
  }

  var businessObject = element.businessObject;

  function startConnect(event, element, autoActivate) {
    connect.start(event, element, autoActivate);
  }

  function removeElement(e) {
    modeling.removeElements([ element ]);
  }

  function getReplaceMenuPosition(element) {

    var Y_OFFSET = 5;

    var diagramContainer = canvas.getContainer(),
        pad = contextPad.getPad(element).html;

    var diagramRect = diagramContainer.getBoundingClientRect(),
        padRect = pad.getBoundingClientRect();

    var top = padRect.top - diagramRect.top;
    var left = padRect.left - diagramRect.left;

    var pos = {
      x: left,
      y: top + padRect.height + Y_OFFSET
    };

    return pos;
  }

  /**
  * Create an append action
  *
  * @param {String} type
  * @param {String} className
  * @param {String} [title]
  * @param {Object} [options]
  *
  * @return {Object} descriptor
  */
  function appendAction(type, className, title, options) {

    if (typeof title !== 'string') {
      options = title;
      title = translate('Append {type}', { type: type.replace(/^dmn:/, '') });
    }

    function appendListener(event, element) {

      var shape = elementFactory.createShape(assign({ type: type }, options));

      create.start(event, shape, {
        source: element
      });
    }

    return {
      group: 'model',
      className: className,
      title: title,
      action: {
        dragstart: appendListener,
        click: appendListener
      }
    };
  }

  if (
    isAny(businessObject, [
      'dmn:InputData',
      'dmn:BusinessKnowledgeModel',
      'dmn:KnowledgeSource',
      'dmn:Decision'
    ])
  ) {
    assign(actions, {
      'append.decision': appendAction('dmn:Decision', 'dmn-icon-decision')
    });
  }

  if (
    isAny(businessObject, [
      'dmn:InputData',
      'dmn:Decision',
      'dmn:KnowledgeSource'
    ])
  ) {
    assign(actions, {
      'append.knowledge-source': appendAction(
        'dmn:KnowledgeSource',
        'dmn-icon-knowledge-source'
      )
    });
  }

  if (isAny(businessObject, [ 'dmn:BusinessKnowledgeModel', 'dmn:KnowledgeSource' ])) {
    assign(actions, {
      'append.business-knowledge-model': appendAction(
        'dmn:BusinessKnowledgeModel',
        'dmn-icon-business-knowledge'
      )
    });
  }

  if (isAny(businessObject, [ 'dmn:Decision' ])) {
    assign(actions, {
      'append.input-data': appendAction('dmn:InputData', 'dmn-icon-input-data')
    });
  }

  if (is(businessObject, 'dmn:DRGElement')) {

    assign(actions, {
      'append.text-annotation': appendAction(
        'dmn:TextAnnotation',
        'dmn-icon-text-annotation'
      ),

      'connect': {
        group: 'connect',
        className: 'dmn-icon-connection-multi',
        title: translate(
          'Connect using Information/Knowledge' +
          '/Authority Requirement or Association'
        ),
        action: {
          click: startConnect,
          dragstart: startConnect
        }
      }
    });
  }

  if (!popupMenu.isEmpty(element, 'dmn-replace')) {

    // Replace menu entry
    assign(actions, {
      'replace': {
        group: 'edit',
        className: 'dmn-icon-screw-wrench',
        title: translate('Change type'),
        action: {
          click: function(event, element) {

            var position = assign(getReplaceMenuPosition(element), {
              cursor: { x: event.x, y: event.y }
            });

            popupMenu.open(element, 'dmn-replace', position);
          }
        }
      }
    });
  }


  // delete element entry, only show if allowed by rules
  var deleteAllowed = rules.allowed('elements.delete', { elements: [ element ] });

  if (isArray(deleteAllowed)) {

    // was the element returned as a deletion candidate?
    deleteAllowed = deleteAllowed[0] === element;
  }

  if (deleteAllowed) {
    assign(actions, {
      'delete': {
        group: 'edit',
        className: 'dmn-icon-trash',
        title: translate('Remove'),
        action: {
          click: removeElement
        }
      }
    });
  }

  return actions;
};
