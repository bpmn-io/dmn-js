import ViewDrdComponent from './components/ViewDrdComponent';

export default class ViewDrd {
  constructor(components, eventBus, injector, sheet) {
    this._injector = injector;

    components.onGetComponent('table.before', () => {
      if (this.canViewDrd()) {
        return ViewDrdComponent;
      }
    });

    eventBus.on('showDrd', () => {
      const parent = injector.get('_parent', false);

      const definitions = parent.getDefinitions();

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

    const definitions = parent.getDefinitions();

    return !!parent.getView(definitions);
  }
}

ViewDrd.$inject = [ 'components', 'eventBus', 'injector' ];
