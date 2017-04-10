'use strict';

var FILTER_REGEX = /^\s*(?:'([^']+)')\s*(?:\|\s*(\w+)\s*)?$/g;
var TEMPLATE_REGEX = /{{([^}]+)}}/g;

/**
 * A parser that processes loaded (HTML) templates
 * before they get used by the app.
 *
 * @param {Function} translate
 *
 * @return {Function} template parser fn
 */
function ParseTemplateFactory(translate) {

  var filters = {
    translate: translate
  };

  function applyFilters(expr) {
    // match expression | filter
    return expr.replace(FILTER_REGEX, function(_, expr, filterName, str) {
      var s = str || applyFilters(expr);
      var cb = filters[filterName];
      if (typeof cb === 'function') {
        return cb(s);
      } else {
        return s;
      }
    });
  }

  return function parseTemplate(templateStr) {
    return templateStr.replace(TEMPLATE_REGEX, function(_, expr) {
      return applyFilters(expr);
    });
  };

}

ParseTemplateFactory.$inject = [ 'translate' ];

module.exports = ParseTemplateFactory;