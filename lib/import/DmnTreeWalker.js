'use strict';

var forEach = require('lodash/collection/forEach'),
    sortBy = require('lodash/collection/sortBy');

var elementToString = require('./Util').elementToString;

function DmnTreeWalker(handler) {

  function visit(element, ctx) {

    var gfx = element.gfx;

    // avoid multiple rendering of elements
    if (gfx) {
      throw new Error('already rendered ' + elementToString(element));
    }

    // call handler
    return handler.element(element, ctx);
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

    handleClauses(table.clause, ctx);

    handleRules(table.rule, ctx);

  }

  function handleClauses(clauses, context) {
    forEach(sortBy(clauses, function(clause) {
      return !clause.inputExpression;
    }), function(e) {
      visit(e, context);
    });
  }

  function handleRules(rules, context) {
    forEach(rules, function(e) {
      visit(e, context);

      handleConditions(e.condition, e);

      handleConclusions(e.conclusion, e);
    });
  }

  function handleConditions(conditions, context) {
    forEach(conditions, function(e) {
      visit(e, context);
    });
  }

  function handleConclusions(conclusions, context) {
    forEach(conclusions, function(e) {
      visit(e, context);
    });
  }

  ///// API ////////////////////////////////

  return {
    handleDefinitions: handleDefinitions
  };
}

module.exports = DmnTreeWalker;
