import {
  bootstrapModeler,
  getDrdJS,
  inject
} from '../../../TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';

var testModules = [ coreModule, modelingModule ];


describe('features/rules', function() {

  describe('move', function() {

    var diagramXML = require('./DrdRules.grouped.dmn');

    beforeEach(bootstrapModeler(diagramXML, {
      modules: testModules
    }));


    Array.prototype.forEach.call('ABCDEFGHIJ', function(group) {

      it('should move Group <' + group + '>', inject(
        function(elementRegistry, drdRules) {

          // given
          var shape_1 = elementRegistry.get(group + '1');
          var shape_2 = elementRegistry.get(group + '2');

          var connection = shape_1.incoming[0] || shape_1.outgoing[0];

          var parent = shape_1.parent;

          // when
          var allowed = drdRules.canMove([ shape_1, shape_2, connection ], parent);

          // then
          expect(allowed).to.be.true;
        }
      ));

    });

  });


  describe('connect', function() {

    var diagramXML = require('./drd-rules.dmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


    it('self', expectCanConnect(
      'Decision_1',
      'Decision_1',
      false
    ));


    it('business knowledge model -> business knowledge model', expectCanConnect(
      'BusinessKnowledgeModel_1',
      'BusinessKnowledgeModel_2',
      { type: 'dmn:KnowledgeRequirement' }
    ));


    it('business knowledge model -> decision', expectCanConnect(
      'BusinessKnowledgeModel_1',
      'Decision_1',
      { type: 'dmn:KnowledgeRequirement' }
    ));


    it('business knowledge model -> input data', expectCanConnect(
      'BusinessKnowledgeModel_1',
      'InputData_1',
      false
    ));


    it('business knowledge model -> knowledge source', expectCanConnect(
      'BusinessKnowledgeModel_1',
      'KnowledgeSource_1',
      false
    ));


    it('decision -> business knowledge model', expectCanConnect(
      'Decision_1',
      'BusinessKnowledgeModel_1',
      false
    ));


    it('decision -> decision', expectCanConnect(
      'Decision_1',
      'Decision_2',
      { type: 'dmn:InformationRequirement' }
    ));


    it('decision -> input data', expectCanConnect(
      'Decision_1',
      'InputData_1',
      false
    ));


    it('decision -> knowledge source', expectCanConnect(
      'Decision_1',
      'KnowledgeSource_1',
      { type: 'dmn:AuthorityRequirement' }
    ));


    it('input data -> business knowledge model', expectCanConnect(
      'InputData_1',
      'BusinessKnowledgeModel_1',
      false
    ));


    it('input data -> decision', expectCanConnect(
      'InputData_1',
      'Decision_1',
      { type: 'dmn:InformationRequirement' }
    ));


    it('input data -> input data', expectCanConnect(
      'InputData_1',
      'InputData_2',
      false
    ));


    it('input data -> knowledge source', expectCanConnect(
      'InputData_1',
      'KnowledgeSource_1',
      { type: 'dmn:AuthorityRequirement' }
    ));


    it('knowledge source -> business knowledge model', expectCanConnect(
      'KnowledgeSource_1',
      'BusinessKnowledgeModel_1',
      { type: 'dmn:AuthorityRequirement' }
    ));


    it('knowledge source -> decision', expectCanConnect(
      'KnowledgeSource_1',
      'Decision_1',
      { type: 'dmn:AuthorityRequirement' }
    ));


    it('knowledge source -> input data', expectCanConnect(
      'KnowledgeSource_1',
      'InputData_1',
      false
    ));


    it('knowledge source -> knowledge source', expectCanConnect(
      'KnowledgeSource_1',
      'KnowledgeSource_2',
      { type: 'dmn:AuthorityRequirement' }
    ));

  });


  describe('create', function() {

    var diagramXML = require('./drd-rules.dmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


    it('decision -> definitions', inject(
      function(drdRules, elementFactory, elementRegistry) {

        // given
        var decision = elementFactory.create('shape', { type: 'dmn:Decision' });

        var definitions = elementRegistry.get('Definitions_1');

        // when
        var allowed = drdRules.canCreate(decision, definitions);

        // then
        expect(allowed).to.be.true;
      }
    ));


    it('decision -> input data', inject(
      function(drdRules, elementFactory, elementRegistry) {

        // given
        var decision = elementFactory.create('shape', { type: 'dmn:Decision' });

        var inputData = elementRegistry.get('InputData_1');

        // when
        var allowed = drdRules.canCreate(decision, inputData);

        // then
        expect(allowed).to.be.false;
      }
    ));

  });


  describe('move', function() {

    it('decision -> definitions', inject(
      function(drdRules, elementRegistry) {

        // given
        var decision = elementRegistry.get('Decision_1'),
            definitions = elementRegistry.get('Definitions_1');

        // when
        var allowed = drdRules.canMove(decision, definitions);

        // then
        expect(allowed).to.be.true;
      }
    ));


    it('decision -> input data', inject(
      function(drdRules, elementRegistry) {

        // given
        var decision = elementRegistry.get('Decision_1'),
            inputData = elementRegistry.get('InputData_1');

        // when
        var allowed = drdRules.canMove(decision, inputData);

        // then
        expect(allowed).to.be.false;
      }
    ));

  });

});

// helpers //////////

function expectCanConnect(source, target, canConnect) {
  return function() {
    getDrdJS().invoke(function(drdRules, elementRegistry) {
      expect(drdRules.canConnect(
        elementRegistry.get(source),
        elementRegistry.get(target)
      )).to.eql(canConnect);
    });
  };
}
