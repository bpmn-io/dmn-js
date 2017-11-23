import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import BaseElementFactory from 'table-js/lib/core/ElementFactory';



export default class ElementFactory extends BaseElementFactory {

  constructor(dmnFactory) {
    super();

    this._dmnFactory = dmnFactory;
  }

  create(tType, attrs) {

    const dmnFactory = this._dmnFactory;

    let { businessObject, type, ...additionalAttrs } = attrs;

    if (!businessObject) {

      if (!type) {

        if (tType === 'root') {
          type = 'dmn:DecisionTable';
        } else if (tType === 'cell') {
          let {
            col
          } = additionalAttrs;

          if (is(col, 'dmn:OutputClause')) {
            type = 'dmn:LiteralExpression';
          }

          if (is(col, 'dmn:InputClause')) {
            type = 'dmn:UnaryTests';
          }
        }

        if (!type) {
          throw new Error('cannot guess <type>');
        }
      }

      businessObject = dmnFactory.create(type);
    }

    return super.create(tType, {
      businessObject,
      id: businessObject.id,
      ...additionalAttrs
    });
  }

}

ElementFactory.$inject = [ 'dmnFactory' ];
