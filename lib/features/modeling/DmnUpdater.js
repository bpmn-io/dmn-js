'use strict';

var inherits = require('inherits'),
    forEach = require('lodash/collection/forEachRight');

var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');


/**
 * A handler responsible for updating the underlying DMN
 * once changes on the diagram happen
 */
function DmnUpdater(eventBus, moddle, elementRegistry) {

  CommandInterceptor.call(this, eventBus);


  function setParent(event) {

    event.context.row.businessObject.$parent = elementRegistry.get('decisionTable').businessObject;
    if(event.context.row.next) {
      event.context.row.businessObject.$parent.rule.splice(
        event.context.row.businessObject.$parent.rule.indexOf(event.context.row.next.businessObject), 0,
        event.context.row.businessObject);
    } else {
      event.context.row.businessObject.$parent.rule.push(event.context.row.businessObject);
    }

  }

  function setColumnParent(event) {

    event.context.column.businessObject.$parent = elementRegistry.get('decisionTable').businessObject;
    if(event.context.column.next) {
      event.context.column.businessObject.$parent.clause.splice(
        event.context.column.businessObject.$parent.clause.indexOf(event.context.column.next.businessObject), 0,
        event.context.column.businessObject);
    } else {
      event.context.column.businessObject.$parent.clause.push(event.context.column.businessObject);
    }
  }

  function unsetParent(event) {
    event.context.column.businessObject.$parent.clause.splice(
      event.context.column.businessObject.$parent.clause.indexOf(event.context.column.businessObject), 1);

    updateRules(event.context.column.businessObject.$parent.rule, event.context.column.businessObject);

  }

  function updateRules(rules, clause) {
    forEach(rules, function(rule) {
      forEach(rule.condition, function(condition) {
        if(condition.$parent === clause) {
          rule.condition.splice(rule.condition.indexOf(condition), 1);
        }
      });
      forEach(rule.conclusion, function(conclusion) {
        if(conclusion.$parent === clause) {
          rule.conclusion.splice(rule.conclusion.indexOf(conclusion), 1);
        }
      });
    });
  }

  function deleteRule(event) {
    // remove references
    // ATTENTION: This assumes that every reference is used only once
    forEach(event.context.row.businessObject.condition, function(condition) {
      var type = condition.$parent.inputEntry ? 'inputEntry' : 'outputEntry';
      condition.$parent[type].splice(condition.$parent[type].indexOf(condition), 1);
    });
    forEach(event.context.row.businessObject.conclusion, function(conclusion) {
      var type = conclusion.$parent.inputEntry ? 'inputEntry' : 'outputEntry';
      conclusion.$parent[type].splice(conclusion.$parent[type].indexOf(conclusion), 1);
    });
    event.context.row.businessObject.$parent.rule.splice(
      event.context.row.businessObject.$parent.rule.indexOf(event.context.row.businessObject), 1);
  }

  this.executed([ 'column.create' ], setColumnParent);
  this.executed([ 'row.create' ], setParent);
  this.executed([ 'column.delete' ], unsetParent);
  this.executed([ 'row.delete' ], deleteRule);

}

inherits(DmnUpdater, CommandInterceptor);

module.exports = DmnUpdater;

DmnUpdater.$inject = [ 'eventBus', 'moddle', 'elementRegistry' ];
