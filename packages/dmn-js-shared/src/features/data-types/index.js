import TranslateModule from 'diagram-js/lib/i18n/translate';

import DataTypes from './DataTypes';
import DefaultDataTypesProvider from './DefaultDataTypesProvider';
import ModelDataTypesProvider from './ModelDataTypesProvider';

export default {
  __depends__: [ TranslateModule ],
  __init__: [ 'dataTypes', 'defaultDataTypesProvider', 'modelDataTypesProvider' ],
  dataTypes: [ 'type', DataTypes ],
  defaultDataTypesProvider: [ 'type', DefaultDataTypesProvider ],
  modelDataTypesProvider: [ 'type', ModelDataTypesProvider ]
};
