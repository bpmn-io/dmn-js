import {
  bootstrapModeler,
  inject
} from '../../../../TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';
import replaceModule from 'src/features/replace';
import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import diagramXML from './replace-element-behavior.dmn';


describe('features/modeling - replace element', function() {

  var testModules = [
    coreModule,
    modelingModule,
    replaceModule
  ];

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules
  }));


  it('should keep id in association refs', inject(
    function(elementRegistry, drdReplace) {

      // given
      var decision = elementRegistry.get('guestCount');

      // when
      drdReplace.replaceElement(decision, {
        type: 'dmn:Decision',
        table: true
      });

      // then
      var newDecision = elementRegistry.get('guestCount'),
          bo = newDecision.businessObject,
          associationBo = elementRegistry.get('association').businessObject;

      expect(bo.decisionTable).to.exist;
      expect(is(bo, 'dmn:Decision')).to.be.true;
      expect(associationBo.sourceRef.href).to.eql('#guestCount');
      expect(associationBo.targetRef.href).to.eql('#textAnnotation');
    }
  ));


  it('should keep id in requirement', inject(
    function(elementRegistry, drdReplace) {

      // given
      var decision = elementRegistry.get('foobar');

      // when
      drdReplace.replaceElement(decision, {
        type: 'dmn:Decision',
        table: true
      });

      // then
      var newDecision = elementRegistry.get('foobar'),
          bo = newDecision.businessObject,
          connectionBo = newDecision.outgoing[0].businessObject;

      expect(bo.decisionTable).to.exist;
      expect(is(bo, 'dmn:Decision')).to.be.true;
      expect(connectionBo.requiredDecision.href).to.eql('#foobar');
    }
  ));

});