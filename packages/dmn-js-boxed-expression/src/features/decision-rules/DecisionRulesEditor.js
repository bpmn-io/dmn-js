import DecisionRulesCellEditorComponent
  from './components/DecisionRulesCellEditorComponent';

const HIGH_PRIORITY = 1500;


export default class RulesEditor {
  constructor(components) {
    components.onGetComponent('cell', HIGH_PRIORITY, ({ cellType }) => {
      if (cellType === 'rule') {
        return DecisionRulesCellEditorComponent;
      }
    });
  }
}

RulesEditor.$inject = [ 'components' ];