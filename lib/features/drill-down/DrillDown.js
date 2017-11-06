import domify from 'min-dom/lib/domify';
import domClasses from 'min-dom/lib/classes';
import domDelegate from 'min-dom/lib/delegate';

export default class DrillDown {

  constructor(eventBus, overlays, drdRules, config) {
    this._eventBus = eventBus;
    this._overlays = overlays;
    this._drdRules = drdRules;
    this._config = config;

    const providers = this._providers = [];
  
    eventBus.on([ 'drdElement.added', 'shape.create' ], ({ element }) => {

      for (let i = 0; i < providers.length; i++) {
        const { provider, className } = providers[i];

        const { businessObject } = element;

        if (provider.canEdit(businessObject)) {
          this.addOverlay(element, className);
          
          break;
        }
      }

    });
  }

  registerProvider(provider, className) {
    this._providers.push({
      provider,
      className
    });
  }

  addOverlay(element, className) {
    const html = domify(`
      <div class="drill-down-overlay">
        <span class="${className}"></span>
      </div>
    `);
  
    const overlayId = this._overlays.add(element, {
      position: {
        top: 2,
        left: 2
      },
      html
    });
  
    if (!this._config.disableDrdInteraction) {
      domClasses(html).add('interactive');

      this.bindEventListener(element, html, overlayId);
    }
  }

  bindEventListener(element, overlay, id) {
    const overlays = this._overlays,
          eventBus = this._eventBus;
  
    const overlaysRoot = overlays._overlayRoot;
  
    domDelegate.bind(overlaysRoot, '[data-overlay-id="' + id + '"]', 'click', () => {
      eventBus.fire('drillDown.editElement', {
        element: element.businessObject
      });
    });
  }

}

DrillDown.$inject = [ 'eventBus', 'overlays', 'drdRules', 'config' ];