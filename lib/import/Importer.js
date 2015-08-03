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
function importDmnTable(sheet, definitions, done) {

  var importer = sheet.get('dmnImporter'),
      eventBus = sheet.get('eventBus');

  var error,
      warnings = [];

  function parse(definitions) {

    var visitor = {

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

    var walker = new DmnTreeWalker(visitor);

    // import
    walker.handleDefinitions(definitions);
  }

  eventBus.fire('import.start');

  try {
    parse(definitions);
  } catch (e) {
    error = e;
  }

  eventBus.fire(error ? 'import.error' : 'import.success', { error: error, warnings: warnings });
  done(error, warnings);
}

module.exports.importDmnTable = importDmnTable;
