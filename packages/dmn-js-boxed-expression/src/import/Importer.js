import TableTreeWalker from './TableTreeWalker';

import { getDecisionTables } from './Util';


/**
 * Import the decision tables of a decision or business knowledge model,
 * if it has any, into the sheet.
 *
 * Throws if a decision table is not valid.
 *
 * @param {Viewer} viewer
 * @param {ModdleElement} element decision or business knowledge model
 */
export function importTables(viewer, element) {
  const tables = getDecisionTables(element);

  if (!tables.length) {
    return;
  }

  const importer = viewer.get('tableImporter');

  const visitor = {
    table(element) {
      return importer.add(element);
    },

    element(element) {
      return importer.add(element);
    }
  };

  const walker = new TableTreeWalker(visitor);

  tables.forEach(table => walker.handleTable(table));
}
