import Inferno from 'inferno';

import ViewerComponent from './components/ViewerComponent';

export default class Renderer {

  constructor(changeSupport, components, config, eventBus, injector) {
    const { container } = config;

    this._container = container;

    eventBus.on('renderer.mount', () => {
      Inferno.render(<ViewerComponent injector={ injector } />, container);
    });

    eventBus.on('renderer.unmount', () => {
      Inferno.render(null, container);
    });
  }

  getContainer() {
    return this._container;
  }

}

Renderer.$inject = [
  'changeSupport',
  'components',
  'config.renderer',
  'eventBus',
  'injector'
];