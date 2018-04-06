import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export default class DecisionTableEditorActions {

  constructor(copyCutPaste, editorActions, modeling, selection, cellSelection, sheet) {
    const actions = {
      addRule() {
        return modeling.addRow({ type: 'dmn:DecisionRule' });
      },
      addRuleAbove(context) {
        let rule = context && context.rule;

        if (!rule && !selection.hasSelection()) {
          return;
        }

        rule = rule || selection.get().row;

        const root = sheet.getRoot(),
              index = root.rows.indexOf(rule);

        if (index === -1) {
          return;
        }

        return modeling.addRow({ type: 'dmn:DecisionRule' }, index);
      },
      addRuleBelow(context) {
        let rule = context && context.rule;

        if (!rule && !selection.hasSelection()) {
          return;
        }

        rule = rule || selection.get().row;

        const root = sheet.getRoot(),
              index = root.rows.indexOf(rule);

        if (index === -1) {
          return;
        }

        return modeling.addRow({ type: 'dmn:DecisionRule' }, index + 1);
      },
      removeRule(context) {
        let rule = context && context.rule;

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

        return modeling.addCol({
          type: 'dmn:InputClause'
        }, input ? input.length : 0);
      },
      addInputLeft(context) {
        let input = context && context.input;

        if (!input && !selection.hasSelection()) {
          return;
        }

        input = input || selection.get().col;

        const root = sheet.getRoot(),
              index = root.cols.indexOf(input);

        if (index === -1) {
          return;
        }

        return modeling.addCol({ type: 'dmn:InputClause' }, index);
      },
      addInputRight(context) {
        let input = context && context.input;

        if (!input && !selection.hasSelection()) {
          return;
        }

        input = input || selection.get().col;

        const root = sheet.getRoot(),
              index = root.cols.indexOf(input);

        if (index === -1) {
          return;
        }

        return modeling.addCol({ type: 'dmn:InputClause' }, index + 1);
      },
      removeInput(context) {
        let input = context && context.input;

        if (!input && !selection.hasSelection()) {
          return;
        }

        input = input || selection.get().col;

        modeling.removeCol(input);
      },
      addOutput() {
        const root = sheet.getRoot(),
              businessObject = root.businessObject;

        const { input, output } = businessObject;

        return modeling.addCol(
          { type: 'dmn:OutputClause' },
          input.length + output.length
        );
      },
      addOutputLeft(context) {
        let output = context && context.output;

        if (!output && !selection.hasSelection()) {
          return;
        }

        output = output || selection.get().col;

        const root = sheet.getRoot(),
              index = root.cols.indexOf(output);

        if (index === -1) {
          return;
        }

        return modeling.addCol({ type: 'dmn:OutputClause' }, index);
      },
      addOutputRight(context) {
        let output = context && context.output;

        if (!output && !selection.hasSelection()) {
          return;
        }

        output = output || selection.get().col;

        const root = sheet.getRoot(),
              index = root.cols.indexOf(output);

        if (index === -1) {
          return;
        }

        return modeling.addCol({ type: 'dmn:OutputClause' }, index + 1);
      },
      removeOutput(context) {
        let output = context && context.output;

        if (!output && !selection.hasSelection()) {
          return;
        }

        output = output || selection.get().col;

        modeling.removeCol(output);
      },
      addClause() {
        if (!selection.hasSelection()) {
          return;
        }

        const clause = selection.get().col;

        if (is(clause, 'dmn:InputClause')) {
          return actions.addInput({ input: clause });
        } else if (is(clause, 'dmn:OutputClause')) {
          return actions.addOutput({ output: clause });
        }
      },
      addClauseLeft() {
        if (!selection.hasSelection()) {
          return;
        }

        const clause = selection.get().col;

        if (is(clause, 'dmn:InputClause')) {
          return actions.addInputLeft({ input: clause });
        } else if (is(clause, 'dmn:OutputClause')) {
          return actions.addOutputLeft({ output: clause });
        }
      },
      addClauseRight() {
        if (!selection.hasSelection()) {
          return;
        }

        const clause = selection.get().col;

        if (is(clause, 'dmn:InputClause')) {
          return actions.addInputRight({ input: clause });
        } else if (is(clause, 'dmn:OutputClause')) {
          return actions.addOutputRight({ output: clause });
        }
      },
      removeClause() {
        if (!selection.hasSelection()) {
          return;
        }

        const clause = selection.get().col;

        if (is(clause, 'dmn:InputClause')) {
          return actions.removeInput({ input: clause });
        } else if (is(clause, 'dmn:OutputClause')) {
          return actions.removeOutput({ output: clause });
        }
      },
      selectCellAbove() {
        return cellSelection.selectCell('above');
      },
      selectCellBelow() {
        return cellSelection.selectCell('below');
      },
      copy({ element }) {
        copyCutPaste.copy(element);
      },
      cut({ element }) {
        copyCutPaste.cut(element);
      },
      pasteBefore({ element }) {
        return copyCutPaste.pasteBefore(element);
      },
      pasteAfter({ element }) {
        return copyCutPaste.pasteAfter(element);
      }
    };

    editorActions.register(actions);
  }
}

DecisionTableEditorActions.$inject = [
  'copyCutPaste',
  'editorActions',
  'modeling',
  'selection',
  'cellSelection',
  'sheet'
];