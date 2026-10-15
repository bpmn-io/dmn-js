import { is } from 'dmn-js-shared/lib/util/ModelUtil';

/**
 * A handler that implements adding/removing allowed values.
 */
export default class UpdateAllowedValuesHandler {

  constructor(dmnFactory, moddle, modeling) {
    this._dmnFactory = dmnFactory;
    this._moddle = moddle;
    this._modeling = modeling;
  }

  /**
   * <do>
   */
  execute(context) {
    const {
      element,
      allowedValues
    } = context;

    const isInput = is(element, 'dmn:InputClause');

    if (isInput) {

      if (element.inputValues) {
        context.oldAllowedValues = element.inputValues.text;
      } else {

        if (!isNull(allowedValues)) {
          element.inputValues = this._dmnFactory.create('dmn:UnaryTests', {
            text: ''
          });
        }

      }

      if (isNull(allowedValues)) {
        if (element.inputValues) {
          delete element.inputValues;
        }
      } else {
        element.inputValues.text = allowedValues.join(',');
      }

    } else {

      if (element.outputValues && element) {
        context.oldAllowedValues = element.outputValues.text;
      } else {

        if (!isNull(allowedValues)) {
          element.outputValues = this._dmnFactory.create('dmn:UnaryTests', {
            text: ''
          });
        }

      }

      if (isNull(allowedValues)) {
        if (element.outputValues) {
          delete element.outputValues;
        }
      } else {
        element.outputValues.text = allowedValues.join(',');
      }


    }

    return element;
  }


  /**
   * <undo>
   */
  revert(context) {
    const {
      element,
      oldAllowedValues
    } = context;

    const isInput = is(element, 'dmn:InputClause');

    if (isInput) {

      if (oldAllowedValues) {

        if (!element.inputValues) {
          element.inputValues = this._dmnFactory.create('dmn:UnaryTests', {
            text: ''
          });
        }

        element.inputValues.text = oldAllowedValues;

      } else {
        delete element.inputValues;
      }

    } else {

      if (oldAllowedValues) {

        if (!element.outputValues) {
          element.outputValues = this._dmnFactory.create('dmn:UnaryTests', {
            text: ''
          });
        }

        element.outputValues.text = oldAllowedValues;

      } else {
        delete element.outputValues;
      }

    }

    return element;
  }

}

UpdateAllowedValuesHandler.$inject = [
  'dmnFactory',
  'moddle',
  'modeling'
];


// helpers //////////////////////

function isNull(value) {
  return value === null;
}