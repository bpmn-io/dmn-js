import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import {
  domify,
  classes as domClasses,
  delegate as domDelegate
} from 'min-dom';


var PROVIDERS = [
  {
    className: 'dmn-icon-decision-table',
    matches: function(el) {
      var businessObject = el.businessObject;

      return is(businessObject, 'dmn:Decision') && businessObject.decisionTable;
    }
  },
  {
    className: 'dmn-icon-literal-expression',
    matches: function(el) {
      var businessObject = el.businessObject;

      return is(businessObject, 'dmn:Decision') && businessObject.literalExpression;
    }
  }
];


/**
 * Displays overlays that can be clicked in order to drill
 * down into a DMN 1.1 element.
 */
export default class DrillDown {

  constructor(injector, eventBus, overlays, config) {
    this._injector = injector;
    this._overlays = overlays;

    this._config = config || { enabled: true };

    eventBus.on([ 'drdElement.added', 'shape.added' ], ({ element }) => {

      for (let i = 0; i < PROVIDERS.length; i++) {

        const { matches, className } = PROVIDERS[i];

        var editable = matches && matches(element);

        if (editable) {
          this.addOverlay(element, className);
        }
      }
    });
  }

  /**
   * Add overlay to an element that enables drill down.
   *
   * @param {Object} element Element to add overlay to.
   * @param {string} className
   *        CSS class that will be added to overlay in order to display icon.
   */
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

    // TODO(nikku): can we remove renamed to drillDown.enabled
    if (this._config.enabled !== false) {
      domClasses(html).add('interactive');

      this.bindEventListener(element, html, overlayId);
    }
  }

  /**
   *
   * @param {Object} element
   * @param {Object} overlay
   * @param {string} id
   */
  bindEventListener(element, overlay, id) {
    const overlays = this._overlays,
          injector = this._injector;

    var parent = injector.get('_parent', false);

    if (!parent) {
      return;
    }

    const overlaysRoot = overlays._overlayRoot;

    domDelegate.bind(overlaysRoot, '[data-overlay-id="' + id + '"]', 'click', () => {

      var view = parent.getView(element.businessObject);

      if (view) {
        parent.open(view);
      }
    });
  }

}

DrillDown.$inject = [
  'injector',
  'eventBus',
  'overlays',
  'config.drillDown'
];