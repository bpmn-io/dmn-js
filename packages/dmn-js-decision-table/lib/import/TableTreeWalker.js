import forEach from 'lodash/forEach';

import { elementToString } from './Util';

export default function TableTreeWalker(handler, options) {

  const canAddMissingEntries = options && options.canAddMissingEntries;

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

  function handleDecision(decision) {
    let missingEntries = null,
        missingClause;

    if (decision.id === '') {
      decision.id = 'decision';
    }

    const table = decision.decisionTable;

    if (table) {
      const ctx = visitTable(table);

      if (canAddMissingEntries && !table.input) {
        table.input = [];

        missingEntries = 'input';

        missingClause = handler.create('dmn:InputClause', ctx, table);

      } else if (canAddMissingEntries && !table.output) {
        table.output = [];

        missingEntries = 'output';

        missingClause = handler.create('dmn:OutputClause', ctx, table);
      }

      handleClauses(table.input, ctx, table);
      handleClauses(table.output, ctx, table);

      if (table.rule && missingEntries) {
        handleMissingEntries(table.rule, missingEntries, missingClause);
      }

      // if any input or output clauses (columns) were added
      // make sure that for each rule the according input/output entry is created
      handleRules(table.rule, ctx, table);
    } else {
      throw new Error(`no table for ${elementToString(decision)}`);
    }

  }

  function handleMissingEntries(rules, missingEntries, missingClause) {
    const isInput = missingEntries === 'input',
          entriesNr = rules[0][(isInput ? 'output' : 'input') + 'Entry'].length,
          entryType = isInput ? 'dmn:UnaryTests' : 'dmn:LiteralExpression';


    forEach(rules, rule => {
      let idx = 0;

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
    handleDecision: handleDecision
  };
}
