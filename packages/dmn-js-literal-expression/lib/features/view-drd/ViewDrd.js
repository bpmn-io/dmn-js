import ViewDrdComponent from './components/ViewDrdComponent';

const HIGH_PRIORITY = 1500;


export default class ViewDrd {

  constructor(components, eventBus, injector, viewer) {
    this._injector = injector;
    this._viewer = viewer;

    components.onGetComponent('viewer', HIGH_PRIORITY, () => {
      if (this.canViewDrd()) {
        return ViewDrdComponent;
      }
    });

    eventBus.on('showDrd', () => {
      const parent = injector.get('_parent', false);

      const definitions = getDefinitions(viewer._decision);

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

    const definitions = getDefinitions(this._viewer._decision);

    return !!parent.getView(definitions);
  }
}

ViewDrd.$inject = [ 'components', 'eventBus', 'injector', 'viewer' ];


// helpers //////////////////////

function getDefinitions(decision) {
  const definitions = decision.$parent;

  return definitions;
}