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
    function(elementRegistry, modeling) {

      // given
      const decision = elementRegistry.get('guestCount'),
            connection = decision.outgoing[0];

      // when
      modeling.updateProperties(decision, { id: 'newId' });

      // then
      expect(connection.businessObject.requiredDecision.href).to.eql('#newId');
    })
  );


  it('should update association sourceRef on source ID change', inject(
    function(elementRegistry, modeling) {

      // given
      const source = elementRegistry.get('dayType_id'),
            connection = source.outgoing[0];

      // when
      modeling.updateProperties(source, { id: 'newId' });

      // then
      expect(connection.businessObject.sourceRef.href).to.eql('#newId');
    })
  );


  it('should update association targetRef on target ID change', inject(
    function(elementRegistry, modeling) {

      // given
      const target = elementRegistry.get('annotation_1'),
            connection = target.incoming[0];

      // when
      modeling.updateProperties(target, { id: 'newId' });

      // then
      expect(connection.businessObject.targetRef.href).to.eql('#newId');
    })
  );
});