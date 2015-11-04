'use strict';

var inherits = require('inherits'),
    forEach = require('lodash/collection/forEachRight');

var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');


/**
 * A handler responsible for updating the underlying DMN
 * once changes on the table happen
 */
function DmnUpdater(eventBus, moddle, elementRegistry, dmnFactory) {

  CommandInterceptor.call(this, eventBus);


  function setParent(event) {

    event.context.row.businessObject.$parent = elementRegistry.get('decisionTable').businessObject;

    // create the rules array if it does not exist
    if(!event.context.row.businessObject.$parent.rule) {
      event.context.row.businessObject.$parent.rule = [];
    }

    if(event.context.row.next) {
      event.context.row.businessObject.$parent.rule.splice(
        event.context.row.businessObject.$parent.rule.indexOf(event.context.row.next.businessObject), 0,
        event.context.row.businessObject);
    } else {
      event.context.row.businessObject.$parent.rule.push(event.context.row.businessObject);
    }

    if(event.context._cells) {
      // if the row has cells, they should be added to the rules
      forEach(event.context._cells, function(cell) {
        if(cell.column.businessObject && cell.content) {
          // if the row has cells, they should be added to the clauses
          var entries = cell.column.businessObject.inputEntry || cell.column.businessObject.outputEntry;
          if(entries.indexOf(cell.content) === -1) {
            entries.push(cell.content);
          }
        }
      });
    }
  }

  function setColumnParent(event) {

    var parent = event.context.column.businessObject.$parent = elementRegistry.get('decisionTable').businessObject;

    var column = event.context.column;
    var businessObject = column.businessObject;
    var nextColumn = event.context.column.next;

    var type = column.isInput ? 'input' : 'output';

    if(nextColumn && nextColumn.businessObject && nextColumn.businessObject.$type === businessObject.$type) {
      parent[type].splice(
        parent[type].indexOf(column.next.businessObject), 0,
        businessObject);
    } else {
      parent[type].push(businessObject);
    }

    // we also have to explicitely create the cells for all rules
    var allRules = parent.rule;
    forEach(allRules, function(rule) {
      var cellBO;
      if(type === 'input') {
        cellBO = dmnFactory.createInputEntry('', businessObject, rule);
      } else {
        cellBO = dmnFactory.createOutputEntry('', businessObject, rule);
      }

      var cell = elementRegistry.filter(function(element) {
        return element._type === 'cell' &&
           element.column === column &&
           element.row.businessObject === rule;
      })[0];

      cell.content = cellBO;

    });

    // if(event.context._cells) {
    //   // if the column has cells, they should be added to the rules
    //   forEach(event.context._cells, function(cell) {
    //     if(!cell.row.isHead && !cell.row.isFoot && cell.content) {
    //       var ruleObj = cell.row.businessObject[
    //             cell.column.businessObject.inputExpression ? 'inputEntry' : 'outputEntry'
    //       ];
    //       if(ruleObj.indexOf(cell.content) === -1) {
    //         ruleObj.push(cell.content);
    //       }
    //     }
    //   });
    // }
  }

  function unsetParent(event) {
    event.context.column.businessObject.$parent.clause.splice(
      event.context.column.businessObject.$parent.clause.indexOf(event.context.column.businessObject), 1);

    updateRules(event.context.column.businessObject.$parent.rule, event.context.column.businessObject);

    // remove the itemDefinition from the Definitions Object
    var p = event.context.column.businessObject;
    while(p && !p.$instanceOf('dmn:Definitions')) {
      p = p.$parent;
    }
    if(event.context.column.businessObject.inputExpression) {
      p.ItemDefinition.splice(p.ItemDefinition.indexOf(
        event.context.column.businessObject.inputExpression.itemDefinition.ref
      ), 1);
    } else {
      p.ItemDefinition.splice(p.ItemDefinition.indexOf(
        event.context.column.businessObject.outputDefinition.ref
      ), 1);
    }

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
      var type = condition.$parent.inputExpression ? 'inputEntry' : 'outputEntry';
      condition.$parent[type].splice(condition.$parent[type].indexOf(condition), 1);
    });
    forEach(event.context.row.businessObject.conclusion, function(conclusion) {
      var type = conclusion.$parent.inputExpression ? 'inputEntry' : 'outputEntry';
      conclusion.$parent[type].splice(conclusion.$parent[type].indexOf(conclusion), 1);
    });
    event.context.row.businessObject.$parent.rule.splice(
      event.context.row.businessObject.$parent.rule.indexOf(event.context.row.businessObject), 1);
  }

  function clearRule(event) {
    forEach(event.context.row.businessObject.condition, function(condition) {
      var type = condition.$parent.inputExpression ? 'inputEntry' : 'outputEntry';
      condition.$parent[type].splice(condition.$parent[type].indexOf(condition), 1);
    });
    forEach(event.context.row.businessObject.conclusion, function(conclusion) {
      var type = conclusion.$parent.inputExpression ? 'inputEntry' : 'outputEntry';
      conclusion.$parent[type].splice(conclusion.$parent[type].indexOf(conclusion), 1);
    });
    event.context.row.businessObject.condition.length = 0;
    event.context.row.businessObject.conclusion.length = 0;
  }

  function unclearRule(event) {
    forEach(event.context._oldContent, function(content) {
      if(typeof content === 'object') {
        // only apply to the moddle objects (e.g. not the linenumber display)
        var type = content.$parent.inputExpression ? 'inputEntry' : 'outputEntry';
        content.$parent[type].push(content);
        event.context.row.businessObject[type === 'inputEntry' ? 'condition' : 'conclusion'].push(content);
      }
    });
  }

  this.executed([ 'column.create' ], setColumnParent);
  this.executed([ 'row.create' ], setParent);
  this.executed([ 'column.delete' ], unsetParent);
  this.executed([ 'row.delete' ], deleteRule);
  this.executed([ 'row.clear' ], clearRule);

  this.reverted([ 'column.create' ], unsetParent);
  this.reverted([ 'row.create' ], deleteRule);
  this.reverted([ 'column.delete' ], setColumnParent);
  this.reverted([ 'row.delete'], setParent);
  this.reverted([ 'row.clear' ], unclearRule);
}

inherits(DmnUpdater, CommandInterceptor);

module.exports = DmnUpdater;

DmnUpdater.$inject = [ 'eventBus', 'moddle', 'elementRegistry', 'dmnFactory' ];
