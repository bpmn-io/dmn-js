import {
  bootstrapModeler,
  inject
} from '../../../../TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';
import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { getMid } from 'diagram-js/lib/layout/LayoutUtil';


describe('features/modeling - replace connection', function() {

  var testModules = [
    coreModule,
    modelingModule
  ];

  var diagramXML = require('./replace-connection-behavior.dmn');

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules
  }));


  describe('reconnect start', function() {

    it('should replace information requirement with authority requirement', inject(
      function(elementRegistry, modeling) {

        // given
        var decision1 = elementRegistry.get('Decision_1'),
            decision2 = elementRegistry.get('Decision_2'),
            connection = modeling.connect(decision1, decision2),
            knowledgeSource = elementRegistry.get('KnowledgeSource_1');

        // when
        modeling.reconnectStart(connection, knowledgeSource, getMid(knowledgeSource));

        // then
        var newConnection = knowledgeSource.outgoing[ 0 ];

        expect(is(newConnection, 'dmn:AuthorityRequirement')).to.be.true;
      }
    ));


    it('should replace information requirement with knowledge requirement', inject(
      function(elementRegistry, modeling) {

        // given
        var decision1 = elementRegistry.get('Decision_1'),
            decision2 = elementRegistry.get('Decision_2'),
            connection = modeling.connect(decision1, decision2),
            businessKnowledgeModel = elementRegistry.get('BusinessKnowledgeModel_1');

        // when
        modeling.reconnectStart(
          connection,
          businessKnowledgeModel,
          getMid(businessKnowledgeModel)
        );

        // then
        var newConnection = businessKnowledgeModel.outgoing[ 0 ];

        expect(is(newConnection, 'dmn:KnowledgeRequirement')).to.be.true;
      }
    ));


    it('should NOT replace information requirement', inject(
      function(elementRegistry, modeling) {

        // given
        var decision1 = elementRegistry.get('Decision_1'),
            decision2 = elementRegistry.get('Decision_2'),
            connection = modeling.connect(decision1, decision2),
            inputData = elementRegistry.get('InputData_1');

        // when
        modeling.reconnectStart(
          connection,
          inputData,
          getMid(inputData)
        );

        // then
        var newConnection = inputData.outgoing[ 0 ];

        expect(is(newConnection, 'dmn:InformationRequirement')).to.be.true;
      }
    ));

  });


  describe('reconnect end', function() {

    it('should replace information requirement with association', inject(
      function(elementRegistry, modeling) {

        // given
        var decision1 = elementRegistry.get('Decision_1'),
            decision2 = elementRegistry.get('Decision_2'),
            connection = modeling.connect(decision1, decision2),
            textAnnotation = elementRegistry.get('TextAnnotation_1');

        // when
        modeling.reconnectEnd(
          connection,
          textAnnotation,
          getMid(textAnnotation)
        );

        // then
        var newConnection = textAnnotation.incoming[ 0 ];

        expect(is(newConnection, 'dmn:Association')).to.be.true;
      }
    ));

  });

});