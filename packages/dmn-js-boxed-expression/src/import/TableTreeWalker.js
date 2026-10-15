import { forEach } from 'min-dash';

import { elementToString } from './Util';

export default function TableTreeWalker(handler) {

  function visit(element) {
    return handler.element(element);
  }

  function visitTable(element) {
    return handler.table(element);
  }


  // Semantic handling //////////////////////

  function handleTable(table) {

    if (!table.output) {
      throw new Error(`missing output for ${ elementToString(table) }`);
    }

    visitTable(table);

    handleClauses(table.input);

    handleClauses(table.output);

    handleRules(table.rule);
  }

  function handleClauses(clauses) {
    forEach(clauses, visit);
  }

  function handleRules(rules) {
    forEach(rules, function(rule) {
      visit(rule);
    });
  }


  // API //////////////////////

  return {
    handleTable
  };
}
