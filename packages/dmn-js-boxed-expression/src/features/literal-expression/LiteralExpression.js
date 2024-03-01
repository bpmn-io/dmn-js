import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import TextareaComponent from './components/LiteralExpressionComponent';

export default class LiteralExpression {
  constructor(components) {
    components.onGetComponent('expression', ({ expression }) => {
      if (is(expression, 'dmn:LiteralExpression')) {
        return TextareaComponent;
      }
    });
  }
}

LiteralExpression.$inject = [ 'components' ];