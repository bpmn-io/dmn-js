import inherits from 'inherits-browser';
import AutoResize from 'diagram-js/lib/features/auto-resize/AutoResize';
import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { DECISION_SERVICE_PADDING } from '../modeling/ElementFactory';

/**
 * DRD-specific auto-resize behavior.
 * @param {Injector} injector
 */

export default function DrdAutoResize(injector) {
  injector.invoke(AutoResize, this);
}

DrdAutoResize.$inject = [ 'injector' ];

inherits(DrdAutoResize, AutoResize);

/**
 * Provide more specific padding for decision-service elements.
 *
 * @param {Shape} shape
 *
 */
DrdAutoResize.prototype.getPadding = function(shape) {
  if (is(shape, 'dmn:DecisionService')) {
    return {
      top: DECISION_SERVICE_PADDING,
      right: DECISION_SERVICE_PADDING,
      bottom: DECISION_SERVICE_PADDING,
      left: DECISION_SERVICE_PADDING
    };
  }
  return AutoResize.prototype.getPadding.call(this, shape);
};