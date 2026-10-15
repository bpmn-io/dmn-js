import { expect } from 'chai';

import { DmnModdle } from 'dmn-moddle';
import { bootstrap, getViewerJS } from '../base/viewer/TestHelper';
import DataTypesModule from 'src/features/data-types';
import { getTypeRefOptions } from 'src/util/TypeRefUtil';


describe('util/TypeRefUtil', function() {

  it('should tag configured and model types with translated groups', function() {

    // given
    const moddle = new DmnModdle();
    const definitions = moddle.create('dmn:Definitions', {
      itemDefinition: [ 'Applicant', 'string', 'Applicant', 'Address' ]
        .map(name => moddle.create('dmn:ItemDefinition', { name }))
    });
    bootstrap({
      modules: [ DataTypesModule ],
      dataTypes: [ 'string', 'integer' ]
    })();

    const dataTypes = getViewerJS().get('dataTypes');
    const translate = text => `translated ${ text }`;

    // when
    const options = getTypeRefOptions(dataTypes, definitions, translate);

    // then
    expect(options).to.eql([
      { value: 'string', label: 'translated string',
        group: { id: 'primitive', name: 'translated Primitive' } },
      { value: 'integer', label: 'translated integer',
        group: { id: 'primitive', name: 'translated Primitive' } },
      { value: 'Applicant', label: 'translated Applicant',
        group: { id: 'custom', name: 'translated Custom' } },
      { value: 'Address', label: 'translated Address',
        group: { id: 'custom', name: 'translated Custom' } }
    ]);
  });
});
