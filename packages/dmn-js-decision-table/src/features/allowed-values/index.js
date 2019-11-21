import AllowedValuesUpdateBehavior from './behavior/AllowedValuesUpdateBehavior';
import AllowedValuesEditingProvider from './AllowedValuesEditingProvider';
import Translate from 'diagram-js/lib/i18n/translate';

export default {
  __depends__: [ Translate ],
  __init__: [
    'allowedValuesUpdateBehavior',
    'allowedValuesEditingProvider',
  ],
  allowedValuesUpdateBehavior: [ 'type', AllowedValuesUpdateBehavior ],
  allowedValuesEditingProvider: [ 'type', AllowedValuesEditingProvider ]
};