import AllowedValuesUpdateBehavior from './behavior/AllowedValuesUpdateBehavior';
import AllowedValuesEditingProvider from './AllowedValuesEditingProvider';

export default {
  __init__: [
    'allowedValuesUpdateBehavior',
    'allowedValuesEditingProvider',
  ],
  allowedValuesUpdateBehavior: [ 'type', AllowedValuesUpdateBehavior ],
  allowedValuesEditingProvider: [ 'type', AllowedValuesEditingProvider ]
};