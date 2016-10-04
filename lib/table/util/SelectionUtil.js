'use strict';


/**
 * Get the correct active entries for the Context Menu
 *
 * @param  {Object} Context - Selected cell
 * @return {Object} {rule, input, output} = Boolean
 */
function getEntriesType(context) {
  var entriesType = {
    rule: false,
    input: false,
    output: false
  };

  if (!context) {
    return entriesType;
  }

  entriesType.rule = !!(context.row && context.row.businessObject &&
         !context.row.businessObject.$instanceOf('dmn:DecisionTable') &&
          context.column.id !== 'utilityColumn');

  if (context.column &&
      context.column.id !== 'utilityColumn' &&
      context.column.id !== 'annotations' &&
      context.row.id !== 'mappingsRow' &&
      context.row.id !== 'typeRow' &&
     !context.row.isLabelRow) {
    if (context.column.businessObject.inputExpression) {
      entriesType.input = true;
    } else {
      entriesType.output = true;
    }
  }

  return entriesType;
}

module.exports.getEntriesType = getEntriesType;
