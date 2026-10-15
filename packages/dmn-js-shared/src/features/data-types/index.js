import DataTypes from './DataTypes';
import ModelDataTypesProvider from './ModelDataTypesProvider';
import DefaultDataTypesProvider from './DefaultDataTypesProvider';

export default {
  __init__: [ 'dataTypes', 'defaultDataTypesProvider', 'modelDataTypesProvider' ],
  dataTypes: [ 'type', DataTypes ],
  modelDataTypesProvider: [ 'type', ModelDataTypesProvider ],
  defaultDataTypesProvider: [ 'type', DefaultDataTypesProvider ]
};