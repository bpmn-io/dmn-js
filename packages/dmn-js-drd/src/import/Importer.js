import DrdTreeWalker from './DrdTreeWalker';


/**
 * Import the definitions into a diagram.
 *
 * Errors and warnings are reported through the specified callback.
 *
 * @param  {Drd} drd
 * @param  {ModdleElement} definitions
 * @param  {Function} done
 *         the callback, invoked with (err, [ warning ]) once the import is done
 */
export function importDRD(drd, definitions, done) {

  var importer = drd.get('drdImporter'),
      eventBus = drd.get('eventBus');

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

  eventBus.fire('import.start', { definitions: definitions });

  try {
    render(definitions);
  } catch (e) {
    error = e;
  }

  eventBus.fire('import.done', { error: error, warnings: warnings });

  done(error, warnings);
}