import ViewDrdComponent from './components/ViewDrdComponent';

export default class ViewDrd {
  constructor(components, eventBus, injector, viewer) {
    this._injector = injector;
    this._viewer = viewer;

    components.onGetComponent('table.before', () => {
      if (this.canViewDrd()) {
        return ViewDrdComponent;
      }
    });

    eventBus.on('showDrd', () => {
      const parent = injector.get('_parent', false);

      const definitions = viewer.getDefinitions();

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

    return !!parent.getView(this._viewer.getDefinitions());
  }
}

ViewDrd.$inject = [ 'components', 'eventBus', 'injector', 'viewer' ];