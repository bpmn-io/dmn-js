/* global sinon */

import { bootstrapModeler, inject } from 'test/helper';

import functionDefinitionXML from './function-definition.dmn';

import { waitFor } from '@testing-library/dom';

describe('FunctionDefinitionEditor', function() {

  const variableResolver = {
    getVariables: () => [
      { name: 'Variable', typeRef: 'string' }
    ],
    registerProvider: () => {}
  };

  beforeEach(bootstrapModeler(functionDefinitionXML, {
    additionalModules: [
      {
        variableResolver: [ 'value', variableResolver ]
      }
    ]
  }));

  describe('#getParameters', function() {

    it('should retrieve parameters', inject(
      function(viewer, functionDefinition) {

        // given
        const bkm = viewer.getRootElement();
        const expression = bkm.get('encapsulatedLogic');

        // when
        const formalParameters = functionDefinition.getParameters(expression);

        // then
        expect(formalParameters).to.have.lengthOf(3);
      })
    );
  });


  describe('#getBody', function() {

    it('should retrieve body', inject(
      function(viewer, functionDefinition) {

        // given
        const bkm = viewer.getRootElement();
        const expression = bkm.get('encapsulatedLogic');

        // when
        const body = functionDefinition.getBody(expression);

        // then
        expect(body).to.have.property('text', 'calendar.getSeason(date)');
      })
    );
  });


  describe('#getKind', function() {

    it('should return FEEL per default', inject(function(viewer, functionDefinition) {

      // given
      const bkm = viewer.getRootElement();
      const expression = bkm.get('encapsulatedLogic');

      // when
      const kind = functionDefinition.getKind(expression);

      // then
      expect(kind).to.eql('FEEL');
    }));
  });


  describe('#addParameter', function() {

    it('should add parameter', inject(
      function(viewer, functionDefinition) {

        // given
        const bkm = viewer.getRootElement();
        const expression = bkm.get('encapsulatedLogic');

        // when
        functionDefinition.addParameter(expression);

        // then
        expect(functionDefinition.getParameters(expression)).to.have.lengthOf(4);
      })
    );
  });


  describe('#removeParameter', function() {

    it('should remove parameter', inject(
      function(viewer, functionDefinition) {

        // given
        const bkm = viewer.getRootElement();
        const expression = bkm.get('encapsulatedLogic');
        const parameters = functionDefinition.getParameters(expression);

        // when
        functionDefinition.removeParameter(expression, parameters[0]);

        // then
        expect(functionDefinition.getParameters(expression)).to.have.lengthOf(2);
      })
    );
  });


  describe('#updateParameter', function() {

    afterEach(function() {
      sinon.restore();
    });


    it('should update parameter', inject(
      function(viewer, functionDefinition) {

        // given
        const bkm = viewer.getRootElement();
        const expression = bkm.get('encapsulatedLogic');
        const parameters = functionDefinition.getParameters(expression);
        const parameter = parameters[0];

        // when
        functionDefinition.updateParameter(parameter, { name: 'foo', typeRef: 'bar' });

        // then
        const updated = functionDefinition.getParameters(expression)[0];
        expect(updated).to.have.property('name', 'foo');
        expect(updated).to.have.property('typeRef', 'bar');
      })
    );

    it('should update variable', inject(
      async function(viewer, functionDefinition) {

        // given
        const bkm = viewer.getRootElement();
        const expression = bkm.get('encapsulatedLogic');
        const parameters = functionDefinition.getParameters(expression);
        const parameter = parameters[0];

        const getVariablesSpy = sinon.spy(variableResolver, 'getVariables');

        // when
        functionDefinition.updateParameter(
          parameter, { name: 'foo-blocker', typeRef: 'bar' }
        );

        // then
        await waitFor(() => {
          expect(getVariablesSpy).to.have.been.called;
        });
      })
    );
  });
});
