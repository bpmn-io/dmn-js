import ViewDrdComponent from './components/ViewDrdComponent';

const VERY_HIGH_PRIORITY = 2000;

export default class ViewDrd {
  constructor(components, eventBus, injector, viewer) {
    components.onGetComponent('viewer', VERY_HIGH_PRIORITY, () => {
      return ViewDrdComponent;
    });

    eventBus.on('showDrd', () => {
      const parent = injector.get('_parent', false);

      if (!parent) {
        return;
      }

      const definitions = getDefinitions(viewer._decision);

      // open definitions
      const view = parent.getView(definitions);

      if (view) {
        parent.open(view);
      }
    });
  }
}

ViewDrd.$inject = [ 'components', 'eventBus', 'injector', 'viewer' ];

////////// helpers //////////

function getDefinitions(decision) {
  const definitions = decision.$parent;

  return definitions;
}