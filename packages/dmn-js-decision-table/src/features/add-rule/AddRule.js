import AddRuleFootComponent from './components/AddRuleFootComponent';

export default class AddRule {
  constructor(components, editorActions, eventBus) {
    components.onGetComponent('table.foot', () => AddRuleFootComponent);

    eventBus.on('addRule', () => {
      editorActions.trigger('addRule');
    });
  }
}

AddRule.$inject = [ 'components', 'editorActions', 'eventBus' ];