import { expect } from 'chai';

import { DmnModdle } from 'dmn-moddle';
import DataTypes from 'src/features/data-types/DataTypes';
import { getTypeRefOptions } from 'src/util/TypeRefUtil';


describe('util/TypeRefUtil', function() {

  it('should tag configured and model types with translated groups', function() {

    // given
    const moddle = new DmnModdle();
    const definitions = moddle.create('dmn:Definitions', {
      itemDefinition: [ 'Applicant', 'string', 'Applicant', 'Address' ]
        .map(name => moddle.create('dmn:ItemDefinition', { name }))
    });
    const dataTypes = new DataTypes([ 'string', 'integer' ]);
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
