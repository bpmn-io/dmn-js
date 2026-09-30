import DataTypes from './DataTypes';
import DefaultDataTypesProvider from './DefaultDataTypesProvider';

export default {
  __init__: [ 'dataTypes', 'defaultDataTypesProvider' ],
  dataTypes: [ 'type', DataTypes ],
  defaultDataTypesProvider: [ 'type', DefaultDataTypesProvider ]
};