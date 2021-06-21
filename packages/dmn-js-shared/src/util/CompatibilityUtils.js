import { isFunction } from 'min-dash';

// TODO: remove with future dmn-js version

/**
 * Wraps APIs to check:
 *
 * 1) If a callback is passed -> Warn users about callback deprecation.
 * 2) If Promise class is implemented in current environment.
 *
 * @private
 */
export function wrapForCompatibility(api) {

  return function() {

    if (!window.Promise) {
      throw new Error('Promises is not supported in this environment.' +
      ' Please polyfill Promise.');
    }

    var argLen = arguments.length;
    if (argLen >= 1 && isFunction(arguments[argLen - 1])) {

      var callback = arguments[argLen - 1];

      console.warn(new Error(
        'Passing callbacks to ' + replaceBoundPrefix(api.name) +
        ' is deprecated and will be removed in a future major release. ' +
        'Please switch to promises: https://bpmn.io/l/moving-to-promises.html'
      ));

      var argsWithoutCallback = Array.prototype.slice.call(arguments, 0, -1);

      api.apply(this, argsWithoutCallback).then(function(result) {

        var firstKey = Object.keys(result)[0];

        // The APIs we are wrapping all resolve a single item depending on the API.
        // For instance, importXML resolves { warnings } and saveXML returns { xml }.
        // That's why we can call the callback with the first item of result.
        return callback(null, result[firstKey]);

        // Passing a second paramter instead of catch because we don't want to
        // catch errors thrown by callback().
      }, function(err) {

        return callback(err, err.warnings);
      });
    } else {

      return api.apply(this, arguments);
    }
  };
}


// helper ////////

/**
 * replaceBoundPrefix - replace the <bound > prefix from a string. Can be used
 * when logging the name of an API, not being sure whether is was bound or not.
 *
 * @param  {string} string
 * @return {string} the string without the <bound > prefix. If no <bound > prefix
 * was present, the same string will be returned.
 */
function replaceBoundPrefix(string) {
  return string.replace('bound ', '');
}
