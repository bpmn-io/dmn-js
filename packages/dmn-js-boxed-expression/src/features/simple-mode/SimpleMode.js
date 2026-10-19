import SimpleModeButtonComponent from './components/SimpleModeButtonComponent';

export default class SimpleMode {

  constructor(components, contextMenu, elementRegistry, eventBus, renderer) {

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

    eventBus.on('cell.click', e => {

      const {
        event,
        node,
        id
      } = e;

      if (isCmd(event)) {
        const element = elementRegistry.get(id);

        if (element) {
          eventBus.fire('simpleMode.open', {
            node,
            element
          });
        }

        // prevent focus
        e.preventDefault();
      }
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

SimpleMode.$inject = [
  'components',
  'contextMenu',
  'elementRegistry',
  'eventBus',
  'renderer'
];


// helpers //////////

export function isCmd(event) {

  // ensure we don't react to AltGr
  // (mapped to CTRL + ALT)
  if (event.altKey) {
    return false;
  }

  return event.ctrlKey || event.metaKey;
}