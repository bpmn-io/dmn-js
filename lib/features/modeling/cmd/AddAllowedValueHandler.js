'use strict';

/**
 * A handler that implements reversible addition of an allowed value for a datatype.
 *
 */
function AddAllowedValueHandler(dmnFactory) {
  this._dmnFactory = dmnFactory;
}

module.exports = AddAllowedValueHandler;
AddAllowedValueHandler.$inject = [ 'dmnFactory' ];



////// api /////////////////////////////////////////


/**
 * Adds the allowed value
 *
 * @param {Object} context
 */
AddAllowedValueHandler.prototype.execute = function(context) {

  if (context.isInput) {
    context.oldValue = context.businessObject.inputValues && context.businessObject.inputValues.text;

    if (!context.businessObject.inputValues) {
      this._dmnFactory.createInputValues(context.businessObject);
    }

    if (context.businessObject.inputValues.text) {
      context.businessObject.inputValues.text += ',"' + context.value + '"';
    } else {
      context.businessObject.inputValues.text = '"' + context.value + '"';
    }
  } else {
    context.oldValue = context.businessObject.outputValues && context.businessObject.outputValues.text;

    if (!context.businessObject.outputValues) {
      this._dmnFactory.createOutputValues(context.businessObject);
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
