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

      var cannotDistribute = isAny(element, [
        'dmn:AuthorityRequirement',
        'dmn:InformationRequirement',
        'dmn:KnowledgeRequirement',
        'dmn:Association',
        'dmn:TextAnnotation'
      ]);

      return !(element.labelTarget || cannotDistribute);
    });
  });
}

DrdDistributeElements.$inject = [ 'distributeElements' ];