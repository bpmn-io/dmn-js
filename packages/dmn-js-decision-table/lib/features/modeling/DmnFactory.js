import { is } from 'dmn-js-shared/lib/util/ModelUtil';


export default class DmnFactory {

  constructor(moddle) {
    this._model = moddle;
  }

  create(type, attrs = {}) {

    var element = this._model.create(type, attrs || {});

    if (is(element, 'dmn:InputClause')) {
      element.inputExpression = this.create('dmn:LiteralExpression', {
        typeRef: 'string'
      });

      element.inputExpression.$parent = element;
    }

    if (is(element, 'dmn:OutputClause')) {
      element.typeRef = 'string';
    }

    this._ensureId(element);

    return element;
  }

  _needsId(element) {
    return is(element, 'dmn:DMNElement');
  }

  _ensureId(element) {

    // generate semantic ids for elements
    // dmn:UnaryTests -> UnaryTests_ID
    var prefix = (element.$type || '').replace(/^[^:]*:/g, '') + '_';

    if (!element.id && this._needsId(element)) {
      element.id = this._model.ids.nextPrefixed(prefix, element);
    }
  }

}

DmnFactory.$inject = [ 'moddle' ];