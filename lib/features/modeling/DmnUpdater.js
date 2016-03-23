'use strict';

var inherits = require('inherits'),
    forEach = require('lodash/collection/forEachRight');

var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');


/**
 * A handler responsible for updating the underlying DMN
 * once changes on the table happen
 */
function DmnUpdater(eventBus, moddle, elementRegistry, dmnFactory, tableName) {

  CommandInterceptor.call(this, eventBus);


  function setParent(event) {

    var businessObject = event.context.row.businessObject;
    var parent = businessObject.$parent = tableName.semantic.decisionTable;


    // create the rules array if it does not exist
    if(!parent.rule) {
      parent.rule = [];
    }

    if(event.context.row.next) {
      parent.rule.splice(
        parent.rule.indexOf(event.context.row.next.businessObject), 0,
        businessObject);
    } else {
      parent.rule.push(businessObject);
    }

    if(!event.context._cells) {
      // we also have to explicitely create the cells for all clauses
      // inputs
      var allInputs = parent.input;

      var filterFunction = function(businessObject) {
        return function(element) {
          return element._type === 'cell' &&
             element.column.businessObject === businessObject &&
             element.row === event.context.row;
        };
      };

      for(var i = 0; i < allInputs.length; i++) {
        var input = allInputs[i];

        var inputCellBO = dmnFactory.createInputEntry('', input, businessObject);

        var inputCell = elementRegistry.filter(filterFunction(input))[0];
        inputCell.content = inputCellBO;
      }

      // outputs
      var allOutputs = parent.output;
      for(i = 0; i < allOutputs.length; i++) {
        var output = allOutputs[i];

        var outputCellBO = dmnFactory.createOutputEntry('', output, businessObject);

        var outputCell = elementRegistry.filter(filterFunction(output))[0];
        outputCell.content = outputCellBO;
      }
    }
  }

  function setColumnParent(event) {

    var parent = event.context.column.businessObject.$parent = tableName.semantic.decisionTable;

    var column = event.context.column;
    var businessObject = column.businessObject;
    var nextColumn = event.context.column.next;

    var type = businessObject.$type === 'dmn:InputClause' ? 'input' : 'output';

    if(nextColumn && nextColumn.businessObject && nextColumn.businessObject.$type === businessObject.$type) {
      parent[type].splice(
        parent[type].indexOf(column.next.businessObject), 0,
        businessObject);
    } else {
      parent[type].push(businessObject);
    }

    if(event.context._cells) {
      // if the column has cells, they should be added to the rules
      forEach(event.context._cells, function(cell) {
        if(!cell.row.isHead && !cell.row.isFoot && cell.content) {
          var ruleObj = cell.row.businessObject[type + 'Entry'];
          ruleObj.splice(parent[type].indexOf(businessObject), 0, cell.content);
        }
      });
    } else {
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
    }
  }

  function unsetParent(event) {

    var businessObject = event.context.column.businessObject;
    var type = businessObject.$type === 'dmn:InputClause' ? 'input' : 'output';

    var idx = businessObject.$parent[type].indexOf(businessObject);

    businessObject.$parent[type].splice(idx, 1);

    forEach(businessObject.$parent.rule, function(rule) {
      rule[type + 'Entry'].splice(idx, 1);
    });
  }

  function deleteRule(event) {
    var businessObject = event.context.row.businessObject;
    businessObject.$parent.rule.splice(
      businessObject.$parent.rule.indexOf(businessObject), 1);
  }

  function moveRow(event) {
    var source = event.context.source.businessObject;
    var target = event.context.target.businessObject;
    var rulesArray = source.$parent.rule;
    var targetIdx;

    // remove source from list
    var sourceIdx = rulesArray.indexOf(source);
    rulesArray.splice(sourceIdx, 1);

    if(event.type.indexOf('.executed') !== -1) {
      // add source at target position
      targetIdx = rulesArray.indexOf(target);
      rulesArray.splice(targetIdx + (event.context.above ? 0 : 1), 0, source);
    } else if (event.type.indexOf('.reverted') !== -1) {
      // add source at previousBelow
      var previousBelow = event.context.previousBelow.businessObject;
      if(previousBelow) {
        targetIdx = rulesArray.indexOf(previousBelow);
        rulesArray.splice(targetIdx, 0, source);
      } else {
        rulesArray.push(source);
      }
    }
  }

  function moveColumn(event) {
    var source = event.context.source.businessObject;
    var target = event.context.target.businessObject;
    var isInput = source.$type === 'dmn:InputClause';
    var targetIdx;

    var columns = source.$parent[isInput ? 'input' : 'output'];
    var rules = source.$parent.rule;

    // remove source from columns
    var sourceIdx = columns.indexOf(source);
    columns.splice(sourceIdx, 1);

    if(event.type.indexOf('.executed') !== -1) {
      // add source at target position
      targetIdx = columns.indexOf(target);
      columns.splice(targetIdx + !event.context.left, 0, source);

      // move all entries in the rules array
      forEach(rules, function(rule) {
        var array = rule[isInput ? 'inputEntry' : 'outputEntry'];

        var element = array.splice(sourceIdx, 1)[0];
        array.splice(targetIdx + !event.context.left, 0, element);
      });
    } else if (event.type.indexOf('.reverted') !== -1) {
      // add source at previousRight
      var previousRight = event.context.previousRight.businessObject;
      if(previousRight && previousRight.$type === source.$type) {
        targetIdx = columns.indexOf(previousRight);
        columns.splice(targetIdx, 0, source);
        forEach(rules, function(rule) {
          var array = rule[isInput ? 'inputEntry' : 'outputEntry'];

          var element = array.splice(sourceIdx, 1)[0];
          array.splice(targetIdx, 0, element);
        });
      } else {
        columns.push(source);
        forEach(rules, function(rule) {
          var array = rule[isInput ? 'inputEntry' : 'outputEntry'];

          var element = array.splice(sourceIdx, 1)[0];
          array.push(element);
        });
      }
    }

    eventBus.fire('column.move.applied');

  }

  this.executed([ 'column.create' ], setColumnParent);
  this.executed([ 'row.create' ], setParent);
  this.executed([ 'column.delete' ], unsetParent);
  this.executed([ 'row.delete' ], deleteRule);
  this.executed([ 'row.move' ], moveRow);
  this.executed([ 'column.move' ], moveColumn);

  this.reverted([ 'column.create' ], unsetParent);
  this.reverted([ 'row.create' ], deleteRule);
  this.reverted([ 'column.delete' ], setColumnParent);
  this.reverted([ 'row.delete' ], setParent);
  this.reverted([ 'row.move' ], moveRow);
  this.reverted([ 'column.move' ], moveColumn);
}

inherits(DmnUpdater, CommandInterceptor);

module.exports = DmnUpdater;

DmnUpdater.$inject = [ 'eventBus', 'moddle', 'elementRegistry', 'dmnFactory', 'tableName' ];
