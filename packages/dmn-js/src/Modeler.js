import EditingManager from 'dmn-js-shared/lib/base/EditingManager';

import DrdModeler from 'dmn-js-drd/lib/Modeler';
import DecisionTableEditor from 'dmn-js-decision-table/lib/Editor';
import LiteralExpressionEditor from 'dmn-js-literal-expression/lib/Editor';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';
import { containsDi } from 'dmn-js-shared/lib/util/DiUtil';
import { find } from 'min-dash';


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
          return is(element, 'dmn:Decision') && element.decisionTable;
        }
      },
      {
        id: 'literalExpression',
        constructor: LiteralExpressionEditor,
        opens(element) {
          return is(element, 'dmn:Decision') && element.literalExpression;
        }
      }
    ];

  }

  _getInitialView(views) {

    var definitionsView;

    for (var i = 0; i < views.length; i++) {

      const view = views[i];
      const el = view.element;

      if (is(el, 'dmn:Decision')) {
        return view;
      }

      if (is(el, 'dmn:Definitions')) {
        definitionsView = view;

        if (containsDi(el)) {
          return view;
        }
      }
    }

    return definitionsView || views[0];
  }

  extractDecisionTable(root, cols, name) {
    const decisionTable = this.getActiveViewer();

    const decisionTableModeling = decisionTable.get('modeling'),
          decisionTableMouse = decisionTable.get('mouse');

    cols.forEach(col => {
      decisionTableModeling.removeCol(col);
    });

    const definitions = getDefinitions(root);

    const view = this.getView(definitions);

    this.open(view);

    const drd = this.getActiveViewer();

    const drdCreate = drd.get('create'),
          drdFactory = drd.get('drdFactory'),
          drdElementRegistry = drd.get('elementRegistry'),
          drdEventBus = drd.get('eventBus'),
          drdElementFactory = drd.get('elementFactory'),
          drdModeling = drd.get('modeling');

    const $decisionTable = drdFactory.create('dmn:DecisionTable');

    // add inputs and outputs
    cols.forEach(col => {
      const { businessObject } = col;

      if (is(businessObject, 'dmn:InputClause')) {
        $decisionTable.get('input').push(businessObject);
      } else if (is(businessObject, 'dmn:InputClause')) {
        $decisionTable.get('output').push(businessObject);
      }

      businessObject.$parent = $decisionTable;
    });

    // add rules
    root.rows.forEach((row, index) => {
      const $rule = drdFactory.create('dmn:DecisionRule');

      $decisionTable.get('rule').push($rule);

      $rule.$parent = $decisionTable;

      cols.forEach(col => {
        const cell = col.cells[ index ];

        const { businessObject } = cell;

        if (is(businessObject, 'dmn:UnaryTests')) {
          $rule.get('inputEntry').push(businessObject);
        } else if (is(businessObject, 'dmn:LiteralExpression')) {
          $rule.get('outputEntry').push(businessObject);
        }

        businessObject.$parent = $rule;
      });
    });

    // ensure at least one output
    if (!$decisionTable.get('output').length) {
      const $outputClause = drdFactory.create('dmn:OutputClause');

      $outputClause.$parent = $decisionTable;
      $outputClause.typeRef = 'string';

      $decisionTable.output = [ $outputClause ];

      $decisionTable.get('rule').forEach($rule => {
        const $literalExpression = drdFactory.create('dmn:LiteralExpression');

        $literalExpression.$parent = $rule;

        $rule.get('outputEntry').push($literalExpression);
      });
    }

    const $decision = drdFactory.create('dmn:Decision', {
      decisionTable: $decisionTable,
      name
    });

    $decisionTable.$parent = $decision;

    const decision = drdElementFactory.createShape({
      type: 'dmn:Decision',
      businessObject: $decision
    });

    drdCreate.start(decisionTableMouse.getLastMoveEvent(), decision);

    function connect({ context }) {
      const { shape } = context;

      if (shape === decision) {
        const source = find(drdElementRegistry.getAll(), element => {
          return element.businessObject.decisionTable === root.businessObject;
        });

        drdModeling.connect(decision, source);
      }
    }

    drdEventBus.once([ 'create.end', 'create.cancel' ], () => {
      drdEventBus.off('commandStack.shape.create.postExecuted', connect);
    });

    drdEventBus.on('commandStack.shape.create.postExecuted', connect);

    console.log(decision);
  }

}


// helpers //////////////////////

function getDefinitions(root) {
  const { businessObject } = root;

  // root might not have business object
  if (!businessObject) {
    return;
  }

  const decision = businessObject.$parent;

  const definitions = decision.$parent;

  return definitions;
}