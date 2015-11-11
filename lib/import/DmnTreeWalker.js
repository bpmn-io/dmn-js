'use strict';

var forEach = require('lodash/collection/forEach');

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

    var decisions = definitions.decision,
        decision;

    if (decisions && decisions.length) {
      decision = decisions[0];
    }

    // no decision -> nothing to import
    if (!decision) {
      return;
    }

    if(decision.id === '') {
      decision.id = 'decision';
    }

    var table = decision.decisionTable;


    // no decision table -> nothing to import
    if(!table) {
      throw new Error('no table for ' + elementToString(decision));
    }

    var ctx = visitTable(table);

    handleClauses(table.input, ctx, definitions);
    handleClauses(table.output, ctx, definitions);

    handleRules(table.rule, ctx, definitions);

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
