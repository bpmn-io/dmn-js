import {
  filter
} from 'min-dash';

import {
  isAny
} from 'dmn-js-shared/lib/util/ModelUtil';


/**
 * Registers element exclude filters for elements that
 * currently do not support distribution.
 */
export default function DrdDistributeElements(distributeElements) {

  distributeElements.registerFilter(function(elements) {
    return filter(elements, function(element) {

      // TODO(nikku): add elements that cannot be distributed
      var cannotDistribute = isAny(element, [

      ]);

      return !(element.labelTarget || cannotDistribute);
    });
  });
}

DrdDistributeElements.$inject = [ 'distributeElements' ];