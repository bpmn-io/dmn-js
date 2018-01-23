import TableTreeWalker from './TableTreeWalker';


/**
 * Import the decision table into a table.
 *
 * Errors and warnings are reported through the specified callback.
 *
 * @param  {decisionTable} decisionTable instance of DecisionTable
 * @param  {ModdleElement} decision moddle element
 * @param  {Function} done
 *         the callback, invoked with (err, [ warning ]) once the import is done
 */
export function importDecision(decisionTable, decision, done) {
  const importer = decisionTable.get('tableImporter'),
        eventBus = decisionTable.get('eventBus'),
        sheet = decisionTable.get('sheet');

  let hasModeling = decisionTable.get('modeling', false);

  let error,
      warnings = [];

  function render(decision) {

    const visitor = {
      create(type, parent, clause, rule) {
        return importer.create(type, parent, clause, rule);
      },

      table(element) {
        return importer.add(element);
      },

      element(element, parentShape, definitions) {
        return importer.add(element, parentShape, definitions);
      },

      error(message, context) {
        warnings.push({ message: message, context: context });
      }
    };

    const walker = new TableTreeWalker(visitor, { canAddMissingEntries: hasModeling });

    // import
    walker.handleDecision(decision);
  }

  eventBus.fire('import.render.start', { decision: decision });

  try {
    render(decision);
  } catch (e) {
    error = e;
  }

  eventBus.fire('import.render.complete', {
    error: error,
    warnings: warnings
  });

  eventBus.fire('elements.changed', {
    elements: [ sheet.getRoot() ]
  });

  done(error, warnings);
}
