var types = [
  'integer',
  'long',
  'double'
];

function hasType(value) {
  return types.indexOf(value) !== -1;
}

function hasNumberType(column) {
  return column &&
         (column.inputExpression &&
         hasType(column.inputExpression.typeRef) ||
         hasType(column.typeRef));
}

module.exports.hasNumberType = hasNumberType;


function isBodyRow(row) {
  return !row.isHead && !row.isFoot;
}

module.exports.isBodyRow = isBodyRow;


function isNumberCell(el) {
  return el._type === 'cell' &&
    hasNumberType(el.column.businessObject) &&
    isBodyRow(el.row);
}

module.exports.isNumberCell = isNumberCell;
