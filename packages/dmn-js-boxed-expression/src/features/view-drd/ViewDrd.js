import ViewDrdComponent from './components/ViewDrdComponent';

const VERY_HIGH_PRIORITY = 2000;


export default class ViewDrd {

  constructor(components, eventBus, injector) {
    this._injector = injector;

    components.onGetComponent('viewer', VERY_HIGH_PRIORITY, () => {
      if (this.canViewDrd()) {
        return ViewDrdComponent;
      }
    });

    eventBus.on('showDrd', () => {
      const parent = injector.get('_parent', false);

      // there is only one single element
      const definitions = parent.getDefinitions();

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
    const definitions = parent.getDefinitions();

    return !!parent.getView(definitions);
  }
}

ViewDrd.$inject = [ 'components', 'eventBus', 'injector' ];
