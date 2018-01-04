import debounce from 'lodash/debounce';

const DEBOUNCE_TIME = 300;

export function debounceOnInput(onInput, config) {
  if (config.deferOnInput !== false) {
    return debounce(onInput, DEBOUNCE_TIME);
  } else {
    return onInput;
  }
}