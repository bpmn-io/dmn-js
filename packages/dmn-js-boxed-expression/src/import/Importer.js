import TableTreeWalker from './TableTreeWalker';

import { getDecisionTable } from './Util';


/**
 * Import the decision table of a decision or business knowledge model,
 * if it has any, into the sheet.
 *
 * Throws if the decision table is not valid.
 *
 * @param {Viewer} viewer
 * @param {ModdleElement} element decision or business knowledge model
 */
export function importTable(viewer, element) {
  const table = getDecisionTable(element);

  if (!table) {
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

  new TableTreeWalker(visitor).handleTable(table);
}
