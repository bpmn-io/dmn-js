import AddRuleFootComponent from './components/AddRuleFootComponent';

export default class AddRule {
  constructor(components, editorActions, eventBus, selection) {
    components.onGetComponent('table.foot', () => AddRuleFootComponent);

    eventBus.on('addRule', (e, context) => {
      const rule = editorActions.trigger('addRule');
      const colIndex = context.colIndex;

      if (rule.cells[colIndex]) {
        selection.select(rule.cells[colIndex]);
      } else {
        selection.select(rule.cells[0]);
      }
    });
  }
}

AddRule.$inject = [ 'components', 'editorActions', 'eventBus', 'selection' ];