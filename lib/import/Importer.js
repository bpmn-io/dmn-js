'use strict';

var DrdTreeWalker = require('./DrdTreeWalker');


/**
 * Import the definitions into a diagram.
 *
 * Errors and warnings are reported through the specified callback.
 *
 * @param  {Canvas} canvas
 * @param  {ModdleElement} definitions
 * @param  {Function} done the callback, invoked with (err, [ warning ]) once the import is done
 */
function importDRD(canvas, definitions, done) {

  var importer = canvas.get('drdImporter'),
      eventBus = canvas.get('eventBus');

  var error,
      warnings = [];

  function render(definitions) {

    var visitor = {
      root: function(element) {
        return importer.root(element);
      },

      element: function(element, di) {
        return importer.add(element, di);
      },

      error: function(message, context) {
        warnings.push({ message: message, context: context });
      }
    };

    var walker = new DrdTreeWalker(visitor);

    // import
    walker.handleDefinitions(definitions);
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

module.exports.importDRD = importDRD;
