import SimpleModeButtonComponent from './components/SimpleModeButtonComponent';

export default class SimpleMode {
  constructor(components, contextMenu, eventBus, renderer) {
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
        element
      });
    });
  }
}

SimpleMode.$inject = [ 'components', 'contextMenu', 'eventBus', 'renderer' ];