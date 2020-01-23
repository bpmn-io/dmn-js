import {
  bootstrapModeler,
  inject
} from '../../../../TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';


describe('features/modeling', function() {

  var testModules = [ coreModule, modelingModule ];

  var diagramXML = require('./create-connection-behavior.dmn');

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules
  }));


  describe('association', function() {

    it('should set sourceRef and targetRef', inject(function(elementRegistry, modeling) {

      // given
      var decision = elementRegistry.get('Decision_1'),
          textAnnotation = elementRegistry.get('TextAnnotation_1');

      // when
      var association = modeling.connect(decision, textAnnotation);

      // then
      var associationBo = association.businessObject,
          sourceRef = associationBo.sourceRef,
          targetRef = associationBo.targetRef;

      expect(sourceRef).to.exist;
      expect(sourceRef.$parent).to.equal(associationBo);
      expect(sourceRef.href).to.equal('#Decision_1');
      expect(targetRef).to.exist;
      expect(targetRef.$parent).to.equal(associationBo);
      expect(targetRef.href).to.equal('#TextAnnotation_1');
    }));

  });


  describe('other', function() {

    it('should create requiredDecision', inject(function(elementRegistry, modeling) {

      // given
      var decision1 = elementRegistry.get('Decision_1'),
          decision2 = elementRegistry.get('Decision_2');

      // when
      var informationRequirement = modeling.connect(decision1, decision2);

      // then
      var informationRequirementBo = informationRequirement.businessObject,
          requiredDecision = informationRequirementBo.requiredDecision;

      expect(requiredDecision).to.exist;
      expect(requiredDecision.$parent).to.equal(informationRequirementBo);
      expect(requiredDecision.href).to.equal('#Decision_1');
    }));

  });

});