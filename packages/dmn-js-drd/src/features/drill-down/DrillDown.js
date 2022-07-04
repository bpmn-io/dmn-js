import {
  getBoxedExpression,
  getBusinessObject,
  is
} from 'dmn-js-shared/lib/util/ModelUtil';

import {
  classes as domClasses,
  delegate as domDelegate
} from 'min-dom';


var PROVIDERS = [
  {
    className: 'dmn-icon-decision-table',
    matches: function(el) {
      var businessObject = getBusinessObject(el);

      return (
        is(businessObject, 'dmn:Decision') &&
        is(businessObject.decisionLogic, 'dmn:DecisionTable')
      );
    },
    title: 'Open decision table'
  },
  {
    className: 'dmn-icon-literal-expression',
    matches: function(el) {
      var boxedExpression = getBoxedExpression(el);

      return is(boxedExpression, 'dmn:LiteralExpression');
    },
    title: 'Open literal expression'
  }
];


/**
 * Displays overlays that can be clicked in order to drill
 * down into a DMN element.
 */
export default class DrillDown {

  constructor(injector, eventBus, overlays, config, translate) {
    this._injector = injector;
    this._eventBus = eventBus;
    this._overlays = overlays;
    this._translate = translate;

    this._config = config || { enabled: true };

    eventBus.on([ 'shape.added' ], ({ element }) => {

      for (let i = 0; i < PROVIDERS.length; i++) {

        const { matches, className, title } = PROVIDERS[i];

        var editable = matches && matches(element);

        if (editable) {
          this.addOverlay(element, className, title);
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
   * @param {string} title added to the button
   */
  addOverlay(element, className, title) {
    const enabled = this._config.enabled !== false;

    const node = this._getOverlayNode(className, title, enabled);

    const overlayId = this._overlays.add(element, {
      position: {
        top: 2,
        left: 2
      },
      html: node
    });

    // TODO(nikku): can we remove renamed to drillDown.enabled
    if (enabled) {
      domClasses(node).add('interactive');
      this.bindEventListener(element, node, overlayId);
    }
  }

  _getOverlayNode(className, title, enabled) {
    const container = document.createElement('div');
    container.className = 'drill-down-overlay';

    if (!enabled) {
      const icon = document.createElement('span');
      icon.className = className;
      container.appendChild(icon);

      return container;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.title = this._translate(title);

    container.appendChild(button);

    return container;
  }

  /**
   * @param {Object} element
   * @param {Object} overlay
   * @param {string} id
   */
  bindEventListener(element, overlay, id) {
    const overlays = this._overlays,
          eventBus = this._eventBus;

    const overlaysRoot = overlays._overlayRoot;

    domDelegate.bind(overlaysRoot, '[data-overlay-id="' + id + '"]', 'click', () => {

      const triggerDefault = eventBus.fire('drillDown.click', {
        element
      });

      if (triggerDefault === false) {
        return;
      }

      this.drillDown(element);
    });
  }


  /**
   * Drill down into the specific element.
   *
   * @param  {djs.model.Base} element
   *
   * @return {boolean} whether drill down was executed
   */
  drillDown(element) {

    const parent = this._injector.get('_parent', false);

    // no parent; skip drill down
    if (!parent) {
      return false;
    }

    const view = parent.getView(element.businessObject);

    // no view to drill down to
    if (!view) {
      return false;
    }

    parent.open(view);

    return true;
  }

}

DrillDown.$inject = [
  'injector',
  'eventBus',
  'overlays',
  'config.drillDown',
  'translate'
];