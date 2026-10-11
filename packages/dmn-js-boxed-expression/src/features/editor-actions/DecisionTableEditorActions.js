import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export default class DecisionTableEditorActions {

  constructor(copyCutPaste, editorActions, modeling, selection, cellSelection, sheet) {

    // the table to act on: the one given, the one of the given element or
    // selection, or the primary one
    function getRoot(context = {}) {
      const element = context.rule || context.input || context.output;

      return context.root ||
        (element && element.root) ||
        (selection.hasSelection() && sheet.getRootOf(selection.get())) ||
        sheet.getRoot();
    }

    const actions = {
      addRule(context) {
        const root = getRoot(context);

        return modeling.addRow({ type: 'dmn:DecisionRule' }, undefined, root);
      },
      addRuleAbove(context) {
        let rule = context && context.rule;

        if (!rule && !selection.hasSelection()) {
          return;
        }

        rule = rule || selection.get().row;

        if (!rule) {
          return;
        }

        const root = rule.root,
              index = root ? root.rows.indexOf(rule) : -1;

        if (index === -1) {
          return;
        }

        return modeling.addRow({ type: 'dmn:DecisionRule' }, index, root);
      },
      addRuleBelow(context) {
        let rule = context && context.rule;

        if (!rule && !selection.hasSelection()) {
          return;
        }

        rule = rule || selection.get().row;

        if (!rule) {
          return;
        }

        const root = rule.root,
              index = root ? root.rows.indexOf(rule) : -1;

        if (index === -1) {
          return;
        }

        return modeling.addRow({ type: 'dmn:DecisionRule' }, index + 1, root);
      },
      removeRule(context) {
        let rule = context && context.rule;

        if (!rule && !selection.hasSelection()) {
          return;
        }

        rule = rule || selection.get().row;

        modeling.removeRow(rule);
      },
      addInput(context) {
        const root = getRoot(context),
              businessObject = root.businessObject;

        const { input } = businessObject;

        return modeling.addCol({
          type: 'dmn:InputClause'
        }, input ? input.length : 0, root);
      },
      addInputLeft(context) {
        let input = context && context.input;

        if (!input && !selection.hasSelection()) {
          return;
        }

        input = input || selection.get().col;

        if (!input) {
          return;
        }

        const root = input.root,
              index = root ? root.cols.indexOf(input) : -1;

        if (index === -1) {
          return;
        }

        return modeling.addCol({ type: 'dmn:InputClause' }, index, root);
      },
      addInputRight(context) {
        let input = context && context.input;

        if (!input && !selection.hasSelection()) {
          return;
        }

        input = input || selection.get().col;

        if (!input) {
          return;
        }

        const root = input.root,
              index = root ? root.cols.indexOf(input) : -1;

        if (index === -1) {
          return;
        }

        return modeling.addCol({ type: 'dmn:InputClause' }, index + 1, root);
      },
      removeInput(context) {
        let input = context && context.input;

        if (!input && !selection.hasSelection()) {
          return;
        }

        input = input || selection.get().col;

        modeling.removeCol(input);
      },
      addOutput(context) {
        const root = getRoot(context),
              businessObject = root.businessObject;

        const input = businessObject.get('input'),
              output = businessObject.get('output');

        return modeling.addCol(
          { type: 'dmn:OutputClause' },
          input.length + output.length,
          root
        );
      },
      addOutputLeft(context) {
        let output = context && context.output;

        if (!output && !selection.hasSelection()) {
          return;
        }

        output = output || selection.get().col;

        if (!output) {
          return;
        }

        const root = output.root,
              index = root ? root.cols.indexOf(output) : -1;

        if (index === -1) {
          return;
        }

        return modeling.addCol({ type: 'dmn:OutputClause' }, index, root);
      },
      addOutputRight(context) {
        let output = context && context.output;

        if (!output && !selection.hasSelection()) {
          return;
        }

        output = output || selection.get().col;

        if (!output) {
          return;
        }

        const root = output.root,
              index = root ? root.cols.indexOf(output) : -1;

        if (index === -1) {
          return;
        }

        return modeling.addCol({ type: 'dmn:OutputClause' }, index + 1, root);
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