import {
  assign,
  every,
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
    translate, config, injector) {

  config = config || {};

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

  if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false);
  }


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
  'translate',
  'config.contextPad',
  'injector'
];


ContextPadProvider.prototype.getContextPadEntries = function(element) {

  var modeling = this._modeling,

      elementFactory = this._elementFactory,
      connect = this._connect,
      create = this._create,
      popupMenu = this._popupMenu,
      contextPad = this._contextPad,
      rules = this._rules,
      translate = this._translate,
      autoPlace = this._autoPlace;

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

    var pad = contextPad.getPad(element).html;

    var padRect = pad.getBoundingClientRect();

    var pos = {
      x: padRect.left,
      y: padRect.bottom + Y_OFFSET
    };

    return pos;
  }

  /**
  * Create an append action
  *
  * @param {string} type
  * @param {string} className
  * @param {string} title
  * @param {Object} [options]
  *
  * @return {Object} descriptor
  */
  function appendAction(type, className, title, options) {

    function appendStart(event, element) {

      var shape = elementFactory.createShape(assign({ type: type }, options));

      create.start(event, shape, {
        source: element,
        hints: {
          connectionTarget: element
        }
      });
    }

    var append = autoPlace ? function(event, element) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      autoPlace.append(element, shape, {
        connectionTarget: element
      });
    } : appendStart;

    return {
      group: 'model',
      className: className,
      title: title,
      action: {
        dragstart: appendStart,
        click: append
      }
    };
  }

  if (is(businessObject, 'dmn:Decision')) {
    assign(actions, {
      'append.decision': appendAction(
        'dmn:Decision',
        'dmn-icon-decision',
        translate('Append decision')
      )
    });
  }

  if (
    isAny(businessObject, [
      'dmn:BusinessKnowledgeModel',
      'dmn:Decision',
      'dmn:KnowledgeSource'
    ])
  ) {
    assign(actions, {
      'append.knowledge-source': appendAction(
        'dmn:KnowledgeSource',
        'dmn-icon-knowledge-source',
        translate('Append knowledge source')
      )
    });
  }

  if (isAny(businessObject, [
    'dmn:BusinessKnowledgeModel',
    'dmn:Decision'
  ])) {
    assign(actions, {
      'append.business-knowledge-model': appendAction(
        'dmn:BusinessKnowledgeModel',
        'dmn-icon-business-knowledge',
        translate('Append business knowledge model')
      )
    });
  }

  if (isAny(businessObject, [ 'dmn:Decision', 'dmn:KnowledgeSource' ])) {
    assign(actions, {
      'append.input-data': appendAction(
        'dmn:InputData',
        'dmn-icon-input-data',
        translate('Append input data')
      )
    });
  }

  if (is(businessObject, 'dmn:DRGElement')) {

    assign(actions, {
      'append.text-annotation': appendAction(
        'dmn:TextAnnotation',
        'dmn-icon-text-annotation',
        translate('Add text annotation')
      ),

      'connect': {
        group: 'connect',
        className: 'dmn-icon-connection-multi',
        title: translate(
          'Connect to other element'
        ),
        action: {
          click: startConnect,
          dragstart: startConnect
        }
      }
    });
  }

  if (is(businessObject, 'dmn:TextAnnotation')) {
    assign(actions, {
      'connect': {
        group: 'connect',
        className: 'dmn-icon-connection-multi',
        title: translate(
          'Connect to other element'
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
        title: translate('Delete'),
        action: {
          click: removeElement
        }
      }
    });
  }

  return actions;
};

ContextPadProvider.prototype.getMultiElementContextPadEntries = function(
    elements
) {
  var modeling = this._modeling,
      translate = this._translate;

  var actions = {};

  if (this._isDeleteAllowed(elements)) {
    assign(actions, {
      'delete': {
        group: 'edit',
        className: 'dmn-icon-trash',
        title: translate('Delete'),
        action: {
          click: (e, elements) => modeling.removeElements(elements.slice())
        },
      },
    });
  }

  return actions;
};

ContextPadProvider.prototype._isDeleteAllowed = function(elements) {

  // rules allowed can return boolean or array of elements (not reflected in type )
  var allowedOrAllowedElements = this._rules.allowed('elements.delete', {
    elements: elements
  });

  if (isArray(allowedOrAllowedElements)) {
    return every(elements, el => allowedOrAllowedElements.includes(el));
  }

  return allowedOrAllowedElements;
};


