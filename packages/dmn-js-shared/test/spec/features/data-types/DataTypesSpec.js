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
].map(name => ({
  name,
  label: name,
  group: { id: 'built-in', name: 'Built-ins' }
}));


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
      { name: 'string', label: 'string' },
      { name: 'boolean', label: 'boolean' }
    ]);
  });


  it('should read data types with group from config', function() {

    // given
    const group = { id: 'custom', name: 'Custom' };

    const dataTypes = createDataTypes({
      dataTypes: [
        'string',
        { name: 'myType', group }
      ]
    });

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList).to.eql([
      { name: 'string', label: 'string' },
      { name: 'myType', label: 'myType', group }
    ]);
  });


  it('should translate labels and group names from config', function() {

    // given
    const dataTypes = createDataTypes({
      dataTypes: [
        { name: 'foo', group: { id: 'custom', name: 'Custom' } },
        { name: 'bar', label: 'Bar label' }
      ],
      additionalModules: [
        {
          translate: [ 'value', text => ({
            foo: 'Foo!',
            'Bar label': 'Bar!',
            Custom: 'Eigene'
          }[text] || text) ]
        }
      ]
    });

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList).to.eql([
      { name: 'foo', label: 'Foo!', group: { id: 'custom', name: 'Eigene' } },
      { name: 'bar', label: 'Bar!' }
    ]);
  });


  it('should normalize string group', function() {

    // given
    const dataTypes = createDataTypes({ dataTypes: [] });

    dataTypes.registerProvider(500, {
      getDataTypes() {
        return [ { name: 'foo', group: 'custom' } ];
      }
    });

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList).to.eql([
      { name: 'foo', label: 'foo', group: { id: 'custom' } }
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
        return [ ...dataTypes, { name: 'myCustomType' } ];
      }
    });

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList).to.eql([
      { name: 'string', label: 'string' },
      { name: 'boolean', label: 'boolean' },
      { name: 'myCustomType', label: 'myCustomType' }
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
        return [ { name: 'onlyThisType' } ];
      }
    });

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList).to.eql([
      { name: 'onlyThisType', label: 'onlyThisType' }
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
        return [ ...dataTypes, { name: 'lowPriorityType' } ];
      }
    });

    dataTypes.registerProvider(2000, {
      getDataTypes(dataTypes) {
        return [ ...dataTypes, { name: 'highPriorityType' } ];
      }
    });

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList).to.eql([
      { name: 'highPriorityType', label: 'highPriorityType' },
      { name: 'string', label: 'string' },
      { name: 'lowPriorityType', label: 'lowPriorityType' }
    ]);
  });


  it('should dedupe data types by name, last one wins', function() {

    // given
    const group = { id: 'custom', name: 'Custom' };

    const dataTypes = createDataTypes({
      dataTypes: [
        'string',
        'boolean'
      ]
    });

    dataTypes.registerProvider(500, {
      getDataTypes(dataTypes) {
        return [ ...dataTypes, { name: 'string', group }, { name: 'other' } ];
      }
    });

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList).to.eql([
      { name: 'string', label: 'string', group },
      { name: 'boolean', label: 'boolean' },
      { name: 'other', label: 'other' }
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
function createDataTypes({ additionalModules = [], ...config } = {}) {
  bootstrap({
    modules: [
      DataTypesModule,
      ...additionalModules
    ],
    ...config
  })();

  return getViewerJS().get('dataTypes');
}
