import TranslateModule from 'diagram-js/lib/i18n/translate';

import DecisionPropertiesEditor from './DecisionPropertiesEditor';
import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';

export default {
  __depends__: [ DebounceInput, TranslateModule ],
  __init__: [ 'decisionProperties' ],
  decisionProperties: [ 'type', DecisionPropertiesEditor ]
};