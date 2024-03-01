import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import EditorComponent from './components/LiteralExpressionEditorComponent';

export default class LiteralExpressionEditor {
  constructor(components) {
    components.onGetComponent('expression', ({ expression }) => {
      if (is(expression, 'dmn:LiteralExpression')) {
        return EditorComponent;
      }
    });
  }
}

LiteralExpressionEditor.$inject = [ 'components' ];