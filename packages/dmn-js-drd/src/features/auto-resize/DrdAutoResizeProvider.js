import inherits from 'inherits-browser';
import AutoResizeProvider from 'diagram-js/lib/features/auto-resize/AutoResizeProvider';
import { is } from 'dmn-js-shared/lib/util/ModelUtil';

/**
 * DRD-specific provider for auto-resize behavior.
 * @param {EventBus} eventBus
 */
export default function DrdAutoResizeProvider(eventBus) {
  AutoResizeProvider.call(this, eventBus);
}

DrdAutoResizeProvider.$inject = [ 'eventBus' ];

inherits(DrdAutoResizeProvider, AutoResizeProvider);

/**
 * DRD-specific check for what elements should be auto-resized.
 *
 * @param {Shape[]} elements
 * @param {Shape} target
 *
 * @return {boolean}
 */

DrdAutoResizeProvider.prototype.canResize = function(elements, target) {
  if (!is(target, 'dmn:DecisionService')) {
    return false;
  }

  return elements.every(function(element) {
    return is(element, 'dmn:Decision') && !element.labelTarget;
  });
};
