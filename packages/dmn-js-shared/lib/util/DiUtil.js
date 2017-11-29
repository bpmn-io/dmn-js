import find from 'lodash/collection/find';
import some from 'lodash/collection/some';

import { is } from './ModelUtil';

/**
 * Does the definitions element contain graphical information?
 *
 * @param  {ModdleElement} definitions
 *
 * @return {Boolean} true, if the definitions contains graphical information
 */
export function containsDi(definitions) {
  return some(definitions.drgElements, hasDi);
}

export function hasDi(element) {

  var extensions = element.extensionElements;

  var values = extensions && extensions.values;

  return values && find(values, function(v) {
    return is(v, 'biodi:Bounds');
  });
}