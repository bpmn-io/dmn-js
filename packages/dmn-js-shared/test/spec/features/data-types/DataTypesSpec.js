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


  describe('diagram types', function() {

    [ 'definitions', 'decision', 'inputExpression' ].forEach(id => {

      it(`should resolve custom types from ${ id }`, async function() {

        // given
        const dataTypes = createDataTypes();
        const { elementsById } = await createDiagram([ 'Applicant', 'Address' ]);

        // when
        const types = dataTypes.getAll(elementsById[id]);

        // then
        expect(types).to.eql([ ...DEFAULT_DATA_TYPES, 'Applicant', 'Address' ]);
      });
    });


    [ 'definitions', 'decision', 'inputExpression' ].forEach(id => {

      it(`should resolve custom types from a wrapped ${ id }`, async function() {

        // given
        const dataTypes = createDataTypes();
        const { elementsById } = await createDiagram([ 'Applicant', 'Address' ]);
        const element = { businessObject: elementsById[id] };

        // when
        const types = dataTypes.getAll(element);

        // then
        expect(types).to.eql([ ...DEFAULT_DATA_TYPES, 'Applicant', 'Address' ]);
      });
    });


    it('should ignore unnamed types and deduplicate names', async function() {

      // given
      const dataTypes = createDataTypes();
      const { rootElement } = await createDiagram([ 'string', 'Applicant', '', 'Applicant' ]);

      // when
      const types = dataTypes.getAll(rootElement);

      // then
      expect(types).to.eql([ ...DEFAULT_DATA_TYPES, 'Applicant' ]);
    });


    it('should merge configured types without changing configuration', async function() {

      // given
      const configuredTypes = [ 'boolean', 'Applicant' ];
      const dataTypes = createDataTypes({ dataTypes: configuredTypes });
      const { rootElement } = await createDiagram([ 'Applicant', 'Address' ]);

      // when
      const types = dataTypes.getAll(rootElement);

      // then
      expect(types).to.eql([ 'boolean', 'Applicant', 'Address' ]);
      expect(dataTypes.getAll()).to.eql([ 'boolean', 'Applicant' ]);
      expect(configuredTypes).to.eql([ 'boolean', 'Applicant' ]);
    });


    it('should preserve types when the diagram has no item definitions', async function() {

      // given
      const dataTypes = createDataTypes();
      const { rootElement } = await createDiagram([]);

      // when
      const types = dataTypes.getAll(rootElement);

      // then
      expect(types).to.eql(DEFAULT_DATA_TYPES);
    });


    it('should support detached elements', function() {

      // given
      const dataTypes = createDataTypes();
      const decision = new DmnModdle().create('dmn:Decision');

      // when
      const types = dataTypes.getAll(decision);

      // then
      expect(types).to.eql(DEFAULT_DATA_TYPES);
    });


    it('should resolve types from the current diagram on every call', async function() {

      // given
      const dataTypes = createDataTypes();
      const first = await createDiagram([ 'Applicant' ]);
      const second = await createDiagram([ 'Address' ]);

      dataTypes.getAll(first.rootElement);

      // when
      const types = dataTypes.getAll(second.rootElement);

      // then
      expect(types).to.eql([ ...DEFAULT_DATA_TYPES, 'Address' ]);
    });
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


function createDiagram(names) {
  return new DmnModdle().fromXML(`
    <definitions id="definitions" xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/">
      ${ names.map((name, index) => `<itemDefinition id="type_${ index }" name="${ name }" />`).join('') }
      <decision id="decision">
        <decisionTable id="table">
          <input id="input">
            <inputExpression id="inputExpression" typeRef="string" />
          </input>
        </decisionTable>
      </decision>
    </definitions>
  `);
}
