import { debounce, isNumber } from 'lodash';

const DEFAULT_DEBOUNCE_TIME = 300;

export default function debounceInput(shouldDebounce) {
  return function _debounceInput(fn) {
    if (shouldDebounce !== false) {
      return debounce(fn, isNumber(shouldDebounce) ? shouldDebounce : DEFAULT_DEBOUNCE_TIME);
    } else {
      return fn;
    }
  };
}

debounceInput.$inject = [ 'config.debounceInput' ];