export default class DecisionTableEditorActions {
  constructor(editorActions, modeling, sheet) {
    const actions = {
      addRule() {
        modeling.addRow({ type: 'dmn:DecisionRule' });
      },
      addRuleAbove({ rule }) {
        const root = sheet.getRoot(),
              index = root.rows.indexOf(rule);

        if (index === -1) {
          return;
        }

        modeling.addRow({ type: 'dmn:DecisionRule' }, index);
      },
      addRuleBelow({ rule }) {
        const root = sheet.getRoot(),
              index = root.rows.indexOf(rule);

        if (index === -1) {
          return;
        }

        modeling.addRow({ type: 'dmn:DecisionRule' }, index + 1);
      },
      removeRule({ rule }) {
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
      }
    };
    
    editorActions.register(actions);
  }
}

DecisionTableEditorActions.$inject = [ 'editorActions', 'modeling', 'sheet' ];