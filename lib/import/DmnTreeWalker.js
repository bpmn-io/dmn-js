'use strict';

var forEach = require('lodash/collection/forEach'),
    sortBy = require('lodash/collection/sortBy');

var elementToString = require('./Util').elementToString;

function DmnTreeWalker(handler) {

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

  function handleDefinitions(definitions) {
    // make sure we walk the correct bpmnElement

    var decisions = definitions.Decision,
        decision;

    if (decisions && decisions.length) {
      decision = decisions[0];
    }

    // no decision -> nothing to import
    if (!decision) {
      return;
    }

    var table = decision.DecisionTable;


    // no decision table -> nothing to import
    if(!table) {
      throw new Error('no table for ' + elementToString(decision));
    }

    var ctx = visitTable(table);

    handleClauses(table.clause, ctx, definitions);

    handleRules(table.rule, ctx, definitions);

  }

  function handleClauses(clauses, context, definitions) {
    forEach(sortBy(clauses, function(clause) {
      return !clause.inputExpression;
    }), function(e) {
      visit(e, context, definitions);
    });
  }

  function handleRules(rules, context, definitions) {
    forEach(rules, function(e) {
      visit(e, context, definitions);

      handleConditions(e.condition, e);

      handleConclusions(e.conclusion, e);
    });
  }

  function handleConditions(conditions, context, definitions) {
    forEach(conditions, function(e) {
      visit(e, context, definitions);
    });
  }

  function handleConclusions(conclusions, context, definitions) {
    forEach(conclusions, function(e) {
      visit(e, context, definitions);
    });
  }

  ///// API ////////////////////////////////

  return {
    handleDefinitions: handleDefinitions
  };
}

module.exports = DmnTreeWalker;
