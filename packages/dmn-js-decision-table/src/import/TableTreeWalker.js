import { forEach } from 'min-dash';

import { elementToString } from './Util';

export default function TableTreeWalker(handler, options) {

  function visit(element, ctx, definitions) {

    var gfx = element.gfx;

    // avoid multiple rendering of elements
    if (gfx) {
      throw new Error(`already rendered ${ elementToString(element) }`);
    }

    // call handler
    return handler.element(element, ctx, definitions);
  }

  function visitTable(element) {
    return handler.table(element);
  }


  // Semantic handling //////////////////////

  function handleDecision(decision) {

    if (!decision.id) {
      decision.id = 'decision';
    }

    const table = decision.decisionLogic;

    if (table) {

      if (!table.output) {
        throw new Error(`missing output for ${ elementToString(table) }`);
      }

      const ctx = visitTable(table);

      if (table.input) {
        handleClauses(table.input, ctx, table);
      }

      handleClauses(table.output, ctx, table);

      // if any input or output clauses (columns) were added
      // make sure that for each rule the according input/output entry is created
      handleRules(table.rule, ctx, table);
    } else {
      throw new Error(`no table for ${ elementToString(decision) }`);
    }

  }

  function handleClauses(clauses, context, definitions) {
    forEach(clauses, function(e) {
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


  // API //////////////////////

  return {
    handleDecision: handleDecision
  };
}
