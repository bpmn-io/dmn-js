import ViewDrdComponent from './components/ViewDrdComponent';

export default class ViewDrd {
  constructor(components, eventBus, injector, sheet) {
    components.onGetComponent('table.before', () => {
      return ViewDrdComponent;
    });

    eventBus.on('showDrd', () => {
      const parent = injector.get('_parent', false);

      if (!parent) {
        return;
      }

      const root = sheet.getRoot();

      const definitions = getDefinitions(root);

      // open definitions
      const view = parent.getView(definitions);

      if (view) {
        parent.open(view);
      }
    });
  }
}

ViewDrd.$inject = [ 'components', 'eventBus', 'injector', 'sheet' ];

////////// helpers //////////

function getDefinitions(root) {
  const { businessObject } = root;

  const decision = businessObject.$parent;

  const definitions = decision.$parent;

  return definitions;
}