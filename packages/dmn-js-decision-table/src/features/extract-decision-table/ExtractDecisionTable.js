import ExtractDecisionTableComponent from './components/ExtractDecisionTableComponent';
import ExtractDecisionTableModalComponent
  from './components/ExtractDecisionTableModalComponent';

export default class ExtractDecisionTable {
  constructor(components, eventBus, injector, sheet) {
    components.onGetComponent('table.before', () => {
      return ExtractDecisionTableComponent;
    });

    components.onGetComponent('table.before', () => {
      return ExtractDecisionTableModalComponent;
    });

    eventBus.on('extractDecisionTable.extract', ({ cols, name }) => {
      const parent = injector.get('_parent', false);

      const root = sheet.getRoot();

      const definitions = getDefinitions(root);

      if (!definitions) {
        return;
      }

      parent.extractDecisionTable(root, cols, name);
    });
  }

  hasDrd() {
    const parent = this._injector.get('_parent', false);

    if (!parent) {
      return false;
    }

    const root = this._sheet.getRoot();

    const definitions = getDefinitions(root);

    return !!parent.getView(definitions);
  }
}

ExtractDecisionTable.$inject = [ 'components', 'eventBus', 'injector', 'sheet' ];


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