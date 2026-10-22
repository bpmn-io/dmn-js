import TranslateModule from 'diagram-js/lib/i18n/translate';

import DataTypes from './DataTypes';
import DefaultDataTypesProvider from './DefaultDataTypesProvider';

export default {
  __depends__: [ TranslateModule ],
  __init__: [ 'dataTypes', 'defaultDataTypesProvider' ],
  dataTypes: [ 'type', DataTypes ],
  defaultDataTypesProvider: [ 'type', DefaultDataTypesProvider ]
};
