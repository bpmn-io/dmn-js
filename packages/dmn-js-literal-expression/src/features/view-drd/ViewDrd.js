import ViewDrdComponent from './components/ViewDrdComponent';

const VERY_HIGH_PRIORITY = 2000;


export default class ViewDrd {

  constructor(components, viewer, eventBus, injector) {
    this._injector = injector;
    this._viewer = viewer;

    components.onGetComponent('viewer', VERY_HIGH_PRIORITY, () => {
      if (this.canViewDrd()) {
        return ViewDrdComponent;
      }
    });

    eventBus.on('showDrd', () => {
      const parent = injector.get('_parent', false);

      const definitions = viewer.getDefinitions();

      // open definitions
      const view = parent.getView(definitions);

      parent.open(view);
    });
  }

  canViewDrd() {
    const parent = this._injector.get('_parent', false);

    if (!parent) {
      return;
    }

    return !!parent.getView(this._viewer.getDefinitions());
  }

}

ViewDrd.$inject = [ 'components', 'viewer', 'eventBus', 'injector' ];