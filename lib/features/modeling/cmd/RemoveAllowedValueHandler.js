'use strict';

/**
 * A handler that implements reversible removal of an allowed value of a datatype.
 *
 */
function RemoveAllowedValueHandler() {
}

module.exports = RemoveAllowedValueHandler;


////// api /////////////////////////////////////////


/**
 * Removes an allowed value
 *
 * @param {Object} context
 */
RemoveAllowedValueHandler.prototype.execute = function(context) {
  var text, entries;

  if (context.isInput) {
    context.oldValue = context.businessObject.inputValues && context.businessObject.inputValues.text;

    text = context.businessObject.inputValues.text;

    entries = text.split(',');

    entries.splice(entries.indexOf(context.value), 1);

    context.businessObject.inputValues.text = entries.join(',');
  } else {
    context.oldValue = context.businessObject.outputValues && context.businessObject.outputValues.text;

    text = context.businessObject.outputValues.text;

    entries = text.split(',');

    entries.splice(entries.indexOf(context.value), 1);

    context.businessObject.outputValues.text = entries.join(',');
  }

  return context;
};


/**
 * Undo Edit by resetting the content
 */
RemoveAllowedValueHandler.prototype.revert = function(context) {

  if (context.oldValue) {
    if (context.isInput) {
      context.businessObject.inputValues.text = context.oldValue;
    } else {
      context.businessObject.outputValues.text = context.oldValue;
    }
  }

  return context;
};
