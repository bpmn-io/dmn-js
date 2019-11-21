import AddRuleFootComponent from './components/AddRuleFootComponent';

export default class AddRule {
  constructor(components, editorActions, eventBus, translate) {
    components.onGetComponent('table.foot', () => AddRuleFootComponent);

    eventBus.on('addRule', () => {
      editorActions.trigger('addRule');
    });
    this._translate = translate;
  }
}

AddRule.$inject = ['components', 'editorActions', 'eventBus', 'translate'];