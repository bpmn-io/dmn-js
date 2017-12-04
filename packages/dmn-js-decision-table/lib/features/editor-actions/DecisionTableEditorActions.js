import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export default class DecisionTableEditorActions {
  constructor(editorActions, modeling, selection, sheet) {
    const actions = {
      addRule() {
        modeling.addRow({ type: 'dmn:DecisionRule' });
      },
      addRuleAbove({ rule }) {
        if (!rule && !selection.hasSelection()) {
          return;
        }

        rule = rule || selection.get().row;

        const root = sheet.getRoot(),
              index = root.rows.indexOf(rule);

        if (index === -1) {
          return;
        }

        modeling.addRow({ type: 'dmn:DecisionRule' }, index);
      },
      addRuleBelow({ rule }) {
        if (!rule && !selection.hasSelection()) {
          return;
        }

        rule = rule || selection.get().row;

        const root = sheet.getRoot(),
              index = root.rows.indexOf(rule);

        if (index === -1) {
          return;
        }

        modeling.addRow({ type: 'dmn:DecisionRule' }, index + 1);
      },
      removeRule({ rule }) {
        if (!rule && !selection.hasSelection()) {
          return;
        }

        rule = rule || selection.get().row;

        modeling.removeRow(rule);
      },
      addInput() {
        const root = sheet.getRoot(),
              businessObject = root.businessObject;

        const { input } = businessObject;

        modeling.addCol({ type: 'dmn:InputClause' }, input.length);
      },
      addInputLeft({ input }) {
        const root = sheet.getRoot(),
              index = root.cols.indexOf(input);

        if (index === -1) {
          return;
        }

        modeling.addCol({ type: 'dmn:InputClause' }, index);
      },
      addInputRight({ input }) {
        const root = sheet.getRoot(),
              index = root.cols.indexOf(input);

        if (index === -1) {
          return;
        }

        modeling.addCol({ type: 'dmn:InputClause' }, index + 1);
      },
      removeInput({ input }) {
        modeling.removeCol(input);
      },
      addOutput() {
        const root = sheet.getRoot(),
              businessObject = root.businessObject;

        const { input, output } = businessObject;

        modeling.addCol({ type: 'dmn:OutputClause' }, input.length + output.length);
      },
      removeOutput({ output }) {
        modeling.removeCol(output);
      },
      addOutputLeft({ output }) {
        const root = sheet.getRoot(),
              index = root.cols.indexOf(output);

        if (index === -1) {
          return;
        }

        modeling.addCol({ type: 'dmn:OutputClause' }, index);
      },
      addOutputRight({ output }) {
        const root = sheet.getRoot(),
              index = root.cols.indexOf(output);

        if (index === -1) {
          return;
        }

        modeling.addCol({ type: 'dmn:OutputClause' }, index + 1);
      },
      addClause() {
        if (!selection.hasSelection()) {
          return;
        }
      },
      addClauseLeft() {
        if (!selection.hasSelection()) {
          return;
        }

        const clause = selection.get().col;
        
        if (is(clause, 'dmn:InputClause')) {
          actions.addInputLeft({ input: clause });
        } else if (is(clause, 'dmn:OutputClause')) {
          actions.addOutputLeft({ output: clause });
        }
      },
      addClauseRight() {
        if (!selection.hasSelection()) {
          return;
        }

        const clause = selection.get().col;
        
        if (is(clause, 'dmn:InputClause')) {
          actions.addInputRight({ input: clause });
        } else if (is(clause, 'dmn:OutputClause')) {
          actions.addOutputRight({ output: clause });
        }
      },
      removeClause() {
        if (!selection.hasSelection()) {
          return;
        }

        const clause = selection.get().col;

        if (is(clause, 'dmn:InputClause')) {
          actions.removeInput({ input: clause });
        } else if (is(clause, 'dmn:OutputClause')) {
          actions.removeOutput({ output: clause });
        }
      }
    };
    
    editorActions.register(actions);
  }
}

DecisionTableEditorActions.$inject = [ 'editorActions', 'modeling', 'selection', 'sheet' ];