'use strict';

/**
 * A handler that implements reversible addition of an allowed value for a datatype.
 *
 */
function AddAllowedValueHandler(tableFactory) {
  this._tableFactory = tableFactory;
}

module.exports = AddAllowedValueHandler;
AddAllowedValueHandler.$inject = [ 'tableFactory' ];



////// api /////////////////////////////////////////


/**
 * Adds the allowed value
 *
 * @param {Object} context
 */
AddAllowedValueHandler.prototype.execute = function(context) {
  var tableFactory = this._tableFactory;

  if (context.isInput) {
    context.oldValue = context.businessObject.inputValues && context.businessObject.inputValues.text;

    if (!context.businessObject.inputValues) {
      tableFactory.createInputValues(context.businessObject);
    }

    if (context.businessObject.inputValues.text) {
      context.businessObject.inputValues.text += ',"' + context.value + '"';
    } else {
      context.businessObject.inputValues.text = '"' + context.value + '"';
    }
  } else {
    context.oldValue = context.businessObject.outputValues && context.businessObject.outputValues.text;

    if (!context.businessObject.outputValues) {
      tableFactory.createOutputValues(context.businessObject);
    }

    if (context.businessObject.outputValues.text) {
      context.businessObject.outputValues.text += ',"' + context.value + '"';
    } else {
      context.businessObject.outputValues.text = '"' + context.value + '"';
    }
  }

  return context;
};


/**
 * Undo Edit by resetting the content
 */
AddAllowedValueHandler.prototype.revert = function(context) {

  if (context.isInput) {
    if (context.oldValue) {
      context.businessObject.inputValues.text = context.oldValue;
    } else {
      context.businessObject.inputValues.text = '';
    }
  } else {
    if (context.oldValue) {
      context.businessObject.outputValues.text = context.oldValue;
    } else {
      context.businessObject.outputValues.text = '';
    }
  }

  return context;
};
