import SimpleModeButtonComponent from './components/SimpleModeButtonComponent';

export default class SimpleMode {
  constructor(components, contextMenu, eventBus, renderer) {
    this._providers = [];

    components.onGetComponent('table.before', () => {
      return SimpleModeButtonComponent;
    });

    eventBus.on('simpleMode.open', ({ element, node }) => {
      const { left, top, width, height } = node.getBoundingClientRect();

      const container = renderer.getContainer();

      contextMenu.open({
        x: left + container.parentNode.scrollLeft,
        y: top + container.parentNode.scrollTop,
        width,
        height
      }, {
        contextMenuType: 'simple-mode-edit',
        element,
        offset: {
          x: 4,
          y: 4
        }
      });
    });
  }

  registerProvider(provider) {
    this._providers.push(provider);
  }

  canSimpleEdit(element) {
    return this._providers.reduce((canSimpleEdit, provider) => {
      return canSimpleEdit || provider(element);
    }, false);
  }
}

SimpleMode.$inject = [ 'components', 'contextMenu', 'eventBus', 'renderer' ];