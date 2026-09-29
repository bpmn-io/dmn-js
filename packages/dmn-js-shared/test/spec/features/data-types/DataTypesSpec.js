import * as sinon from 'sinon';
import { expect } from 'chai';
import { bootstrap, getViewerJS } from '../../base/viewer/TestHelper';

import DataTypesModule from 'src/features/data-types';


const DEFAULT_DATA_TYPES = [
  'string',
  'boolean',
  'number',
  'date',
  'time',
  'dateTime',
  'dayTimeDuration',
  'yearMonthDuration',
  'Any'
];


describe('DataTypes', function() {

  it('should set default data types', function() {

    // given
    const dataTypes = createDataTypes();

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList).to.eql(DEFAULT_DATA_TYPES);
  });


  it('should read data types from config', function() {

    // given
    const dataTypes = createDataTypes({
      dataTypes: [
        'string',
        'boolean'
      ]
    });

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList).to.eql([
      'string',
      'boolean'
    ]);
  });


  it('should add data types via provider', function() {

    // given
    const dataTypes = createDataTypes({
      dataTypes: [
        'string',
        'boolean'
      ]
    });

    dataTypes.registerProvider(500, {
      getDataTypes(dataTypes) {
        return [ ...dataTypes, 'myCustomType' ];
      }
    });

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList).to.eql([
      'string',
      'boolean',
      'myCustomType'
    ]);
  });


  it('should alter data types via provider', function() {

    // given
    const dataTypes = createDataTypes({
      dataTypes: [
        'string',
        'boolean'
      ]
    });

    dataTypes.registerProvider(500, {
      getDataTypes() {
        return [ 'onlyThisType' ];
      }
    });

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList).to.eql([
      'onlyThisType'
    ]);
  });


  it('should apply providers in priority order', function() {

    // given
    const dataTypes = createDataTypes({
      dataTypes: [
        'string'
      ]
    });

    dataTypes.registerProvider(500, {
      getDataTypes(dataTypes) {
        return [ ...dataTypes, 'lowPriorityType' ];
      }
    });

    dataTypes.registerProvider(2000, {
      getDataTypes(dataTypes) {
        return [ ...dataTypes, 'highPriorityType' ];
      }
    });

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList).to.eql([
      'highPriorityType',
      'string',
      'lowPriorityType'
    ]);
  });


  it('should call higher priority provider before default one', function() {

    // given
    const dataTypes = createDataTypes({
      dataTypes: [
        'string'
      ]
    });

    const getDataTypes = sinon.spy(dataTypes => dataTypes);

    dataTypes.registerProvider(2000, { getDataTypes });

    // when
    dataTypes.getAll();

    // then
    expect(getDataTypes).to.have.been.calledOnceWith([]);
  });
});



// helper
function createDataTypes(config) {
  bootstrap({
    modules: [
      DataTypesModule
    ],
    ...config
  })();

  return getViewerJS().get('dataTypes');
}
