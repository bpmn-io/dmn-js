import {
  bootstrapModeler,
  inject
} from 'test/helper';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';

import diagramXML from 'test/fixtures/dmn/simple-connections.dmn';

describe('IdChangeBehavior', function() {

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      CoreModule,
      ModelingModule
    ]
  }));


  it('should update IDs on decision ID change', inject(
    function(elementRegistry,modeling) {

      // given
      const decision = elementRegistry.get('guestCount'),
            connection = decision.outgoing[0];

      // when
      modeling.updateProperties(decision, { id: 'newId' });

      // then
      expect(connection.businessObject.requiredDecision.href).to.eql('#newId');
    })
  );
});