'use strict';

var hasStringType = function(column) {
  return column &&
         (column.inputExpression &&
         column.inputExpression.typeRef === 'string' ||
         column.typeRef === 'string');
};
var isBodyRow = function(row) {
  return !row.isHead && !row.isFoot;
};

var hasTextContent = function(el) {
  return el.content && typeof el.content.text !== 'undefined';
};

module.exports = {
  isStringCell: function(el) {
    return el._type === 'cell' &&
      hasStringType(el.column.businessObject) &&
      hasTextContent(el) &&
      isBodyRow(el.row);
  },
  parseString: function(string) {
    // three cases: empty, disjunction, and negated dijunction

    // try empty
    if (string.trim() === '') {
      return {
        type: 'disjunction',
        values: []
      };
    }

    // try disjunction
    var values = string.split(',');
    var out = {
      type: 'disjunction',
      values: []
    };
    var openString = '';
    values.forEach(function(value) {
      openString += value;
      if (/^"[^"]*"$/.test(openString.trim())) {
        out.values.push(openString.trim().slice(1,-1));
        openString = '';
      } else {
        openString += ',';
      }
    });
    if (!openString) {
      return out;
    }

    // try negation
    out.type = 'negation';
    out.values = [];
    openString = '';
    var info = string.match(/^\s*not\((.*)\)\s*$/);
    if (info) {
      values = info[1].split(',');
      values.forEach(function(value) {
        openString += value;
        if (/^"[^"]*"$/.test(openString.trim())) {
          out.values.push(openString.trim().slice(1,-1));
          openString = '';
        } else {
          openString += ',';
        }
      });
      if (!openString) {
        return out;
      }
    }
  },
  parseAllowedValues: function(el) {
    var bo = el.column.businessObject;
    var values = bo && (bo.inputValues || bo.outputValues);
    if (values && values.text) {
      values = values.text.split(',');
      return values.map(function(value) {
        if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
          return value.slice(1,-1);
        } else {
          return value;
        }
      });
    }
  }
};
