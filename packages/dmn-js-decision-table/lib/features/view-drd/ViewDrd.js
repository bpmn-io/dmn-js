import ViewDrdComponent from './components/ViewDrdComponent';

export default class ViewDrd {
  constructor(components, eventBus, injector, sheet) {
    this._injector = injector;
    this._sheet = sheet;

    components.onGetComponent('table.before', () => {
      if (this.canViewDrd()) {
        return ViewDrdComponent;
      }
    });

    eventBus.on('showDrd', () => {
      const parent = injector.get('_parent', false);

      const root = sheet.getRoot();

      const definitions = getDefinitions(root);

      if (!definitions) {
        return;
      }

      // open definitions
      const view = parent.getView(definitions);

      parent.open(view);
    });
  }

  canViewDrd() {
    const parent = this._injector.get('_parent', false);

    if (!parent) {
      return false;
    }

    const root = this._sheet.getRoot();

    const definitions = getDefinitions(root);

    return !!parent.getView(definitions);
  }
}

ViewDrd.$inject = [ 'components', 'eventBus', 'injector', 'sheet' ];


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