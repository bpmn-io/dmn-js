'use strict';

var DmnTreeWalker = require('./DmnTreeWalker');


/**
 * Import the definitions into a table.
 *
 * Errors and warnings are reported through the specified callback.
 *
 * @param  {Sheet} sheet
 * @param  {ModdleElement} definitions
 * @param  {Function} done the callback, invoked with (err, [ warning ]) once the import is done
 */
function importDmnTable(sheet, definitions, decisionIdx, done) {

  var importer = sheet.get('dmnImporter'),
      eventBus = sheet.get('eventBus');

  var hasModeling;

  try {
    hasModeling = sheet.get('modeling');
  } catch (e) {
    hasModeling = false;
  }

  var error,
      warnings = [];

  function render(definitions) {

    var visitor = {
      create: function(type, parent, clause, rule) {
        return importer.create(type, parent, clause, rule);
      },

      table: function(element) {
        return importer.add(element);
      },

      element: function(element, parentShape, definitions) {
        return importer.add(element, parentShape, definitions);
      },

      error: function(message, context) {
        warnings.push({ message: message, context: context });
      }
    };

    var walker = new DmnTreeWalker(visitor, { canAddMissingEntries: hasModeling });

    // import
    walker.handleDefinitions(definitions, decisionIdx);
  }

  eventBus.fire('import.render.start', { definitions: definitions });

  try {
    render(definitions);
  } catch (e) {
    error = e;
  }

  eventBus.fire('import.render.complete', {
    error: error,
    warnings: warnings
  });


  done(error, warnings);
}

module.exports.importDmnTable = importDmnTable;
