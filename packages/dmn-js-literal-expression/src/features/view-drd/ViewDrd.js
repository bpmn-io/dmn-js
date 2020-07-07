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

      // there is only one single element
      const definitions = this.getDefinitions();

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

    // there is only one single element
    const definitions = this.getDefinitions();

    return !!parent.getView(definitions);
  }

  getDefinitions() {
    return getDefinitions(this._viewer.getDecision());
  }

}

ViewDrd.$inject = [ 'components', 'viewer', 'eventBus', 'injector' ];


// helpers //////////////////////

function getDefinitions(decision) {
  const definitions = decision.$parent;

  return definitions;
}