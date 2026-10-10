import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import { query as domQuery } from 'min-dom';

import { translateModule } from 'dmn-js-shared/test/util/TranslateUtil';

import {
  triggerInputEvent,
  triggerInputSelectChange
} from 'dmn-js-shared/test/util/EventUtil';

import { bootstrapModeler, inject } from 'test/helper';

import functionDefinitionXML from '../function-definition/function-definition.dmn';
import literalExpressionXML from '../../literal-expression.dmn';
import noVariableXML from '../../no-variable.dmn';
import noTypeRefXML from './no-type-ref.dmn';


describe('ElementVariableEditor', function() {

  describe('business knowledge model', function() {

    beforeEach(bootstrapModeler(functionDefinitionXML));


    describe('#getType', function() {

      it('should read type from function body, not variable', inject(
        function(elementVariable) {

          // when
          const type = elementVariable.getType();

          // then
          expect(type).to.equal('Any');
        }
      ));
    });


    describe('#setType', function() {

      it('should set type on function body', inject(
        function(elementVariable, viewer, functionDefinition) {

          // given
          const bkm = viewer.getRootElement();
          const encapsulatedLogic = bkm.get('encapsulatedLogic');

          // when
          elementVariable.setType('number');

          // then
          const body = functionDefinition.getBody(encapsulatedLogic);

          expect(body.get('typeRef')).to.equal('number');
        }
      ));


      it('should remove type from function body if empty', inject(
        function(elementVariable, viewer, functionDefinition) {

          // given
          const bkm = viewer.getRootElement();
          const encapsulatedLogic = bkm.get('encapsulatedLogic');

          elementVariable.setType('number');

          // when
          elementVariable.setType('');

          // then
          const body = functionDefinition.getBody(encapsulatedLogic);

          expect(body.get('typeRef')).not.to.exist;
        }
      ));


      it('should not write type to variable', inject(
        function(elementVariable, viewer) {

          // given
          const bkm = viewer.getRootElement();

          // when
          elementVariable.setType('number');

          // then
          const variable = bkm.get('variable');

          expect(variable.get('typeRef')).to.equal('string');
        }
      ));
    });
  });


  describe('decision', function() {

    beforeEach(bootstrapModeler(literalExpressionXML));


    describe('#getType', function() {

      it('should read type from variable', inject(
        function(elementVariable) {

          // when
          const type = elementVariable.getType();

          // then
          expect(type).to.equal('string');
        }
      ));


      it('should default to Any when variable has no type', inject(
        function(elementVariable, viewer) {

          // given
          const decision = viewer.getRootElement();
          const variable = decision.get('variable');

          delete variable.typeRef;

          // when
          const type = elementVariable.getType();

          // then
          expect(type).to.equal('Any');
        }
      ));
    });


    describe('#setType', function() {

      it('should set type on variable', inject(
        function(elementVariable, viewer) {

          // given
          const decision = viewer.getRootElement();

          // when
          elementVariable.setType('number');

          // then
          const variable = decision.get('variable');

          expect(variable.get('typeRef')).to.equal('number');
        }
      ));


      it('should remove type from variable if empty', inject(
        function(elementVariable, viewer) {

          // given
          const decision = viewer.getRootElement();

          // when
          elementVariable.setType('');

          // then
          const variable = decision.get('variable');

          expect(variable.get('typeRef')).not.to.exist;
        }
      ));
    });
  });


  describe('decision without variable', function() {

    let testContainer;

    beforeEach(function() {
      testContainer = TestContainer.get(this);
    });

    beforeEach(bootstrapModeler(noVariableXML));


    it('should create variable when setting type', inject(
      function(elementVariable, viewer) {

        // when
        elementVariable.setType('boolean');

        // then
        const variable = viewer.getRootElement().get('variable');

        expect(variable.get('typeRef')).to.equal('boolean');
        expect(variable.get('name')).to.equal('Season');
        expect(variable.get('id')).to.exist;
      }
    ));


    it('should update displayed name when decision is renamed', inject(
      function(modeling, viewer) {

        // when
        modeling.updateProperties(viewer.getRootElement(), { name: 'foo' });

        // then
        expect(domQuery('.element-variable-name', testContainer).textContent)
          .to.contain('foo');
      }
    ));

  });


  describe('decision without type reference', function() {

    beforeEach(bootstrapModeler(noTypeRefXML));


    it('should set type', inject(function(elementVariable, viewer) {

      // when
      elementVariable.setType('boolean');

      // then
      expect(viewer.getRootElement().get('variable').get('typeRef'))
        .to.equal('boolean');
    }));

  });


  describe('editing', function() {

    let testContainer;

    beforeEach(function() {
      testContainer = TestContainer.get(this);
    });

    beforeEach(bootstrapModeler(literalExpressionXML, { debounceInput: false }));

    function queryTypeSelect() {
      return domQuery('.element-variable-type .dms-input-select', testContainer);
    }


    it('should render', function() {

      // then
      expect(queryTypeSelect()).to.exist;
    });


    it('should render accessible label for type', function() {

      // when
      const label = domQuery('.element-variable-type-label', testContainer);

      // then
      expect(label.getAttribute('for'))
        .to.equal(domQuery('input[id]', queryTypeSelect()).id);
    });


    it('should edit type - input', inject(function(viewer) {

      // given
      const input = domQuery('.dms-input', queryTypeSelect());

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(viewer.getRootElement().get('variable').get('typeRef'))
        .to.equal('foo');
    }));


    it('should edit type - select', inject(function(viewer) {

      // given
      const inputSelect = queryTypeSelect();

      // when
      triggerInputSelectChange(inputSelect, 'boolean', testContainer);

      // then
      expect(viewer.getRootElement().get('variable').get('typeRef'))
        .to.equal('boolean');
    }));


    it('should remove type', inject(function(viewer) {

      // given
      triggerInputSelectChange(queryTypeSelect(), 'boolean', testContainer);

      const input = domQuery('.dms-input', queryTypeSelect());

      // when
      triggerInputEvent(input, '');

      // then
      expect(viewer.getRootElement().get('variable').get('typeRef'))
        .not.to.exist;
    }));

  });


  describe('translation', function() {

    let testContainer;

    beforeEach(function() {
      testContainer = TestContainer.get(this);
    });

    beforeEach(bootstrapModeler(literalExpressionXML, {
      additionalModules: [ translateModule ]
    }));


    it('should translate title', function() {

      // then
      expect(domQuery('.element-variable h2', testContainer).textContent)
        .to.equal('tr(Result)');
    });


    it('should translate result type label', function() {

      // then
      expect(domQuery('.element-variable-type-label', testContainer).textContent)
        .to.equal('tr(Result type)');
    });

  });
});
