'use strict';


var assign = require('lodash/object/assign'),
    isArray = require('lodash/lang/isArray');

var ModelUtil = require('../../util/ModelUtil'),
    is = ModelUtil.is,
    isAny = ModelUtil.isAny,
    hasPrimaryModifier = require('diagram-js/lib/util/Mouse').hasPrimaryModifier;

/**
* A provider for DMN 1.1 elements context pad
*/
function ContextPadProvider(eventBus, contextPad, modeling, elementFactory, connect, create, rules) {

  contextPad.registerProvider(this);

  this._contextPad = contextPad;

  this._modeling = modeling;

  this._elementFactory = elementFactory;
  this._connect = connect;
  this._create = create;
  this._rules = rules;


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
  'rules'
];

module.exports = ContextPadProvider;


ContextPadProvider.prototype.getContextPadEntries = function(element) {

  var modeling = this._modeling,

      elementFactory = this._elementFactory,
      connect = this._connect,
      create = this._create,
      rules = this._rules;


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
      title = 'Append ' + type.replace(/^dmn\:/, '');
    }

    function appendListener(event, element) {

      var shape = elementFactory.createShape(assign({ type: type }, options));
      create.start(event, shape, element);
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

  if (isAny(businessObject, [ 'dmn:InputData', 'dmn:BusinessKnowledgeModel', 'dmn:KnowledgeSource', 'dmn:Decision' ])) {
    assign(actions, {
      'append.decision': appendAction('dmn:Decision', 'dmn-icon-decision')
    });
  }

  if (isAny(businessObject, [ 'dmn:InputData', 'dmn:Decision', 'dmn:KnowledgeSource' ])) {
    assign(actions, {
      'append.knowledge-source': appendAction('dmn:KnowledgeSource', 'dmn-icon-knowledge-source')
    });
  }

  if (isAny(businessObject, [ 'dmn:BusinessKnowledgeModel', 'dmn:KnowledgeSource' ])) {
    assign(actions, {
      'append.business-knowledge-model': appendAction('dmn:BusinessKnowledgeModel', 'dmn-icon-business-knowledge')
    });
  }

  if (is(businessObject, 'dmn:DRGElement')) {

    assign(actions, {
      'append.text-annotation': appendAction('dmn:TextAnnotation', 'dmn-icon-text-annotation'),

      'connect': {
        group: 'connect',
        className: 'dmn-icon-connection-multi',
        title: 'Connect using Information/Knowledge/Authority Requirement or Association',
        action: {
          click: startConnect,
          dragstart: startConnect
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
        title: 'Remove',
        action: {
          click: removeElement,
          dragstart: removeElement
        }
      }
    });
  }

  return actions;
};
