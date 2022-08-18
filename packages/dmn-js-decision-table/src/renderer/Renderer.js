import BaseRenderer from 'table-js/lib/render/Renderer';

export default class Renderer extends BaseRenderer {

  constructor(changeSupport, components, config, eventBus, injector) {
    super(changeSupport, components, config, eventBus, injector);

    const container = config.container;

    // make keyboard selectable
    container.setAttribute('tabindex', '0');

    setupKeybordBindings(container, eventBus);
  }
}

Renderer.$inject = [
  'changeSupport',
  'components',
  'config.renderer',
  'eventBus',
  'injector'
];


// helpers ///////////////////

function setupKeybordBindings(container, eventBus) {

  // focus container on hover if body was previously focused
  container.addEventListener('mouseover', function() {
    if (document.activeElement === document.body) {
      container.focus({ preventScroll: true });
    }
  });

  // ensure we focus the container if the users clicks
  // inside; this follows input focus handling closely
  container.addEventListener('click', function(event) {

    // force focus when clicking container
    if (!container.contains(document.activeElement)) {
      // console.log('FOCUS', event.target, document.activeElement);

      container.focus({ preventScroll: true });
    }
  });
}