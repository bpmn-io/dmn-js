import inherits from 'inherits-browser';

import OrderingProvider from 'diagram-js/lib/features/ordering/OrderingProvider';

import {
  is,
  isAny
} from 'dmn-js-shared/lib/util/ModelUtil';

import {
  findIndex,
  find
} from 'min-dash';

/**
 * @typedef {import('diagram-js/lib/core/Canvas').default} Canvas
 * @typedef {import('diagram-js/lib/core/EventBus').default} EventBus
 */

/**
 * A DMN-specific ordering provider.
 *
 * @param {EventBus} eventBus
 * @param {Canvas} canvas
 */
export default function DmnOrderingProvider(eventBus, canvas) {

  OrderingProvider.call(this, eventBus);

  const orders = [

    // associations and requirements are rendered on top of everything else
    { type: 'dmn:Association', order: { level: 9 } },
    { type: 'dmn:AuthorityRequirement', order: { level: 9 } },
    { type: 'dmn:InformationRequirement', order: { level: 9 } },
    { type: 'dmn:KnowledgeRequirement', order: { level: 9 } },
    { type: 'dmn:Artifact', order: { level: 8 } },
    { type: 'dmn:DRGElement', order: { level: 2 }, containers: [ 'dmn:DecisionService' ] },
  ];

  function computeOrder(element) {
    const entry = find(orders, function(o) {
      return isAny(element, [ o.type ]);
    });

    return entry && entry.order || { level: 1 };
  }

  function getOrder(element) {

    let order = element.order;

    if (!order) {
      element.order = order = computeOrder(element);
    }

    if (!order) {
      throw new Error(`no order for <${ element.id }>`);
    }

    return order;
  }

  function findActualParent(element, newParent, containers) {

    let actualParent = newParent;

    while (actualParent) {

      if (isAny(actualParent, containers)) {
        break;
      }

      actualParent = actualParent.parent;
    }

    if (!actualParent) {
      throw new Error(`no parent for <${ element.id }> in <${ newParent && newParent.id }>`);
    }

    return actualParent;
  }

  this.getOrdering = function(element, newParent) {

    // render labels and text annotations always on top
    if (element.labelTarget || is(element, 'bpmn:TextAnnotation')) {
      return {
        parent: canvas.findRoot(newParent) || canvas.getRootElement(),
        index: -1
      };
    }

    const elementOrder = getOrder(element);

    if (elementOrder.containers) {
      newParent = findActualParent(element, newParent, elementOrder.containers);
    }

    let currentIndex = newParent.children.indexOf(element);

    let insertIndex = findIndex(newParent.children, function(child) {

      // do not compare with labels, they are created
      // in the wrong order (right after elements) during import and
      // mess up the positioning.
      if (!element.labelTarget && child.labelTarget) {
        return false;
      }

      return elementOrder.level < getOrder(child).level;
    });


    // if the element is already in the child list at
    // a smaller index, we need to adjust the insert index.
    // this takes into account that the element is being removed
    // before being re-inserted
    if (insertIndex !== -1) {
      if (currentIndex !== -1 && currentIndex < insertIndex) {
        insertIndex -= 1;
      }
    }

    return {
      index: insertIndex,
      parent: newParent
    };
  };
}

DmnOrderingProvider.$inject = [ 'eventBus', 'canvas' ];

inherits(DmnOrderingProvider, OrderingProvider);