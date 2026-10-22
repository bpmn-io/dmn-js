import * as sinon from 'sinon';
import { expect } from 'chai';
import { DmnModdle } from 'dmn-moddle';
import { bootstrap, getViewerJS } from '../../base/viewer/TestHelper';

import DataTypesModule from 'src/features/data-types';


const DEFAULT_DATA_TYPES = [
  'string',
  'boolean',
  'number',
  'date',
  'time',
  'date and time',
  'days and time duration',
  'years and months duration',
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


  it('should not translate group ID used as name', function() {

    // given
    const dataTypes = createDataTypes({
      dataTypes: [
        { name: 'foo', group: 'custom' },
        { name: 'bar', group: { id: 'other' } }
      ],
      additionalModules: [
        { translate: [ 'value', text => text.toUpperCase() ] }
      ]
    });

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList.map(t => t.group)).to.eql([
      { id: 'custom', name: 'custom' },
      { id: 'other', name: 'other' }
    ]);
  });


  it('should keep empty label', function() {

    // given
    const dataTypes = createDataTypes({ dataTypes: [] });

    dataTypes.registerProvider(500, {
      getDataTypes() {
        return [ { name: 'foo', label: '' } ];
      }
    });

    // when
    const dataTypesList = dataTypes.getAll();

    // then
    expect(dataTypesList).to.eql([ { name: 'foo', label: '' } ]);
  });


  it('should use group ID as name by default', function() {

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
      { name: 'foo', label: 'foo', group: { id: 'custom', name: 'custom' } }
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


  describe('model data types', function() {

    it('should not add custom types without viewer', async function() {

      // given
      const dataTypes = createDataTypes();

      // when
      const types = dataTypes.getAll();

      // then
      expect(types).to.eql(DEFAULT_DATA_TYPES);
    });


    it('should not add custom types without definitions', function() {

      // given
      const dataTypes = createDataTypes({
        additionalModules: [ createViewerModule(() => undefined) ]
      });

      // when
      const types = dataTypes.getAll();

      // then
      expect(types).to.eql(DEFAULT_DATA_TYPES);
    });


    it('should not add custom types without item definitions', async function() {

      // given
      const definitions = await createDefinitions([]);

      const dataTypes = createDataTypes({
        additionalModules: [ createViewerModule(() => definitions) ]
      });

      // when
      const types = dataTypes.getAll();

      // then
      expect(types).to.eql(DEFAULT_DATA_TYPES);
    });


    it('should add item definitions of viewer definitions', async function() {

      // given
      const definitions = await createDefinitions([ 'Guest', 'Season' ]);

      const dataTypes = createDataTypes({
        additionalModules: [ createViewerModule(() => definitions) ]
      });

      // when
      const types = dataTypes.getAll();

      // then
      expect(types).to.eql([
        ...DEFAULT_DATA_TYPES,
        customType('Guest'),
        customType('Season')
      ]);
    });


    it('should translate group name', async function() {

      // given
      const definitions = await createDefinitions([ 'Guest' ]);

      const dataTypes = createDataTypes({
        additionalModules: [
          createViewerModule(() => definitions),
          { translate: [ 'value', text => text === 'Custom' ? 'Eigene' : text ] }
        ]
      });

      // when
      const types = dataTypes.getAll();

      // then
      expect(types.pop()).to.eql({
        name: 'Guest',
        label: 'Guest',
        group: { id: 'custom', name: 'Eigene' }
      });
    });


    it('should ignore unnamed item definitions', async function() {

      // given
      const definitions = await createDefinitions([ 'Guest', '' ]);

      const dataTypes = createDataTypes({
        additionalModules: [ createViewerModule(() => definitions) ]
      });

      // when
      const types = dataTypes.getAll();

      // then
      expect(types).to.eql([ ...DEFAULT_DATA_TYPES, customType('Guest') ]);
    });


    it('should dedupe item definitions by name', async function() {

      // given
      const definitions = await createDefinitions([ 'Guest', 'Guest' ]);

      const dataTypes = createDataTypes({
        additionalModules: [ createViewerModule(() => definitions) ]
      });

      // when
      const types = dataTypes.getAll();

      // then
      expect(types).to.eql([ ...DEFAULT_DATA_TYPES, customType('Guest') ]);
    });


    it('should keep existing data type of same name', async function() {

      // given
      const definitions = await createDefinitions([ 'string' ]);

      const dataTypes = createDataTypes({
        additionalModules: [ createViewerModule(() => definitions) ]
      });

      // when
      const types = dataTypes.getAll();

      // then
      expect(types).to.eql(DEFAULT_DATA_TYPES);
    });


    it('should append to configured data types', async function() {

      // given
      const definitions = await createDefinitions([ 'Guest', 'Season' ]);

      const dataTypes = createDataTypes({
        dataTypes: [ 'boolean', 'Guest' ],
        additionalModules: [ createViewerModule(() => definitions) ]
      });

      // when
      const types = dataTypes.getAll();

      // then
      expect(types).to.eql([
        { name: 'boolean', label: 'boolean' },
        { name: 'Guest', label: 'Guest' },
        customType('Season')
      ]);
    });


    it('should not modify configured data types', async function() {

      // given
      const configuredTypes = [ 'boolean', 'Guest' ];
      const definitions = await createDefinitions([ 'Season' ]);

      const dataTypes = createDataTypes({
        dataTypes: configuredTypes,
        additionalModules: [ createViewerModule(() => definitions) ]
      });

      // when
      dataTypes.getAll();

      // then
      expect(configuredTypes).to.eql([ 'boolean', 'Guest' ]);
    });


    it('should allow later provider to alter custom types', async function() {

      // given
      const definitions = await createDefinitions([ 'Guest' ]);

      const dataTypes = createDataTypes({
        additionalModules: [ createViewerModule(() => definitions) ]
      });

      dataTypes.registerProvider(250, {
        getDataTypes: types => types.filter(({ group }) => group.id === 'custom')
      });

      // when
      const types = dataTypes.getAll();

      // then
      expect(types).to.eql([ customType('Guest') ]);
    });


    it('should pick up item definitions added after import', async function() {

      // given
      const definitions = await createDefinitions([]);

      const dataTypes = createDataTypes({
        additionalModules: [ createViewerModule(() => definitions) ]
      });

      definitions.get('itemDefinition').push(
        new DmnModdle().create('dmn:ItemDefinition', { name: 'Guest' })
      );

      // when
      const types = dataTypes.getAll();

      // then
      expect(types).to.eql([ ...DEFAULT_DATA_TYPES, customType('Guest') ]);
    });


    it('should follow definitions of viewer', async function() {

      // given
      let definitions = await createDefinitions([ 'Guest' ]);

      const dataTypes = createDataTypes({
        additionalModules: [ createViewerModule(() => definitions) ]
      });

      dataTypes.getAll();

      definitions = await createDefinitions([ 'Season' ]);

      // when
      const types = dataTypes.getAll();

      // then
      expect(types).to.eql([ ...DEFAULT_DATA_TYPES, customType('Season') ]);
    });
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


function createViewerModule(getDefinitions) {
  return { viewer: [ 'value', { getDefinitions } ] };
}


function customType(name) {
  return { name, label: name, group: { id: 'custom', name: 'Custom' } };
}


async function createDefinitions(names) {
  const itemDefinitions = names
    .map((name, index) => `<itemDefinition id="type_${ index }" name="${ name }" />`)
    .join('');

  const { rootElement } = await new DmnModdle().fromXML(`
    <definitions id="definitions" xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/">
      ${ itemDefinitions }
    </definitions>
  `);

  return rootElement;
}
