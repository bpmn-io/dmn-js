import EditingManager from 'dmn-js-shared/lib/base/EditingManager';

import DrdModeler from 'dmn-js-drd/lib/Modeler';
import DecisionTableEditor from 'dmn-js-decision-table/lib/Editor';
import LiteralExpressionEditor from 'dmn-js-literal-expression/lib/Editor';


/**
 * The dmn editor.
 */
export default class Modeler extends EditingManager {

  _getViewProviders() {

    return [
      {
        id: 'drd',
        constructor: DrdModeler,
        opens: 'dmn:Definitions'
      },
      {
        id: 'decisionTable',
        constructor: DecisionTableEditor,
        opens(element) {
          return element.$type === 'dmn:Decision' && element.decisionTable;
        }
      },
      {
        id: 'literalExpression',
        constructor: LiteralExpressionEditor,
        opens(element) {
          return element.$type === 'dmn:Decision' && element.literalExpression;
        }
      }
    ];

  }
}