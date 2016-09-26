'use strict';

var forEach = require('lodash/collection/forEach');

var elementToString = require('./Util').elementToString;

function DmnTreeWalker(handler, options) {

  var canAddMissingEntries = options && options.canAddMissingEntries;

  function visit(element, ctx, definitions) {

    var gfx = element.gfx;

    // avoid multiple rendering of elements
    if (gfx) {
      throw new Error('already rendered ' + elementToString(element));
    }

    // call handler
    return handler.element(element, ctx, definitions);
  }

  function visitTable(element) {
    return handler.table(element);
  }

  ////// Semantic handling //////////////////////

  function handleDefinitions(definitions, decisionIdx) {
    // make sure we walk the correct bpmnElement

    var decisions = definitions.decision,
        missingEntries = null,
        missingClause,
        decision;

    if (decisions && decisions.length) {
      decision = decisions[decisionIdx];
    }

    // no decision -> nothing to import
    if (!decision) {
      return;
    }

    if (decision.id === '') {
      decision.id = 'decision';
    }

    var table = decision.decisionTable;


    // no decision table -> nothing to import
    if (!table) {
      throw new Error('no table for ' + elementToString(decision));
    }

    var ctx = visitTable(table);


    if (canAddMissingEntries && !table.input) {
      table.input = [];

      missingEntries = 'input';

      missingClause = handler.create('dmn:InputClause', ctx, definitions);

    } else if (canAddMissingEntries && !table.output) {
      table.output = [];

      missingEntries = 'output';

      missingClause = handler.create('dmn:OutputClause', ctx, definitions);
    }

    handleClauses(table.input, ctx, definitions);
    handleClauses(table.output, ctx, definitions);

    if (table.rule && missingEntries) {
      handleMissingEntries(table.rule, missingEntries, missingClause);
    }

    // if any input or output clauses (columns) were added
    // make sure that for each rule the according input/output entry is created
    handleRules(table.rule, ctx, definitions);
  }

  function handleMissingEntries(rules, missingEntries, missingClause) {
    var isInput = missingEntries === 'input',
        entriesNr = rules[0][(isInput ? 'output' : 'input') + 'Entry'].length,
        entryType = isInput ? 'dmn:UnaryTests' : 'dmn:LiteralExpression';


    forEach(rules, function(rule) {
      var idx = 0;

      for (idx; idx < entriesNr; idx++) {
        handler.create(entryType, missingClause, rule);
      }
    });
  }

  function handleClauses(inputs, context, definitions) {
    forEach(inputs, function(e) {
      visit(e, context, definitions);
    });
  }

  function handleRules(rules, context, definitions) {
    forEach(rules, function(e) {
      visit(e, context, definitions);

      handleEntry(e.inputEntry, e);

      handleEntry(e.outputEntry, e);
    });
  }

  function handleEntry(entry, context, definitions) {
    forEach(entry, function(e) {
      visit(e, context, definitions);
    });
  }

  ///// API ////////////////////////////////

  return {
    handleDefinitions: handleDefinitions
  };
}

module.exports = DmnTreeWalker;
