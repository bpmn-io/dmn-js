import { expect } from 'chai';
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


  it('should normalize legacy FEEL type refs to DMN spec names', function() {

    // given
    const dataTypes = createDataTypes();

    // then
    expect(dataTypes.getLabel('dateTime')).to.equal('date and time');
    expect(dataTypes.getLabel('dayTimeDuration')).to.equal('days and time duration');
    expect(dataTypes.getLabel('yearMonthDuration')).to.equal('years and months duration');
    expect(dataTypes.getLabel('string')).to.equal('string');
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
