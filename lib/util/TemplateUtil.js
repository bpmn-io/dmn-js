'use strict';

var $injects = {};

function inject(filter, callback) {
  $injects[filter] = callback;
}

module.exports.inject = inject;

function _filter(expr) {
  // match expression | filter
  return expr.replace(/^\s*(.+)\s*\|\s*(\w+)\s*|\s*\'(.+)\'\s*$/, function(_, expr, filter, str) {
    var s = str || _filter(expr);
    var cb = $injects[filter];
    if (typeof cb === 'function') {
      return cb(s);
    } else {
      return s;
    }
  });
}

function parse(template) {
  return template.replace(/{{\s*(.+)\s*}}/g, function(_, expr) {
    return _filter(expr);
  });
}

module.exports.parse = parse;
