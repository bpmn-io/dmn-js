import { expect } from 'chai';
import {
  bootstrapModeler,
  inject
} from '../../../../TestHelper';

import coreModule from 'src/core';
import modelingModule from 'src/features/modeling';


describe('features/modeling - CreateShapeBehavior', function() {

  var testModules = [ coreModule, modelingModule ];

  var diagramXML = require('./create-shape-behavior.dmn');

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules
  }));


  it('should create a default variable for a new decision', inject(
    function(canvas, elementFactory, modeling) {

      // given
      var rootElement = canvas.getRootElement();

      // when
      var decision = elementFactory.createShape({ type: 'dmn:Decision' });
      modeling.createShape(decision, { x: 100, y: 100 }, rootElement);

      // then
      var variable = decision.businessObject.variable;

      expect(variable).to.exist;
      expect(variable.typeRef).to.equal('Any');
      expect(variable.$parent).to.equal(decision.businessObject);
    }
  ));


  it('should create a default variable for a new input data', inject(
    function(canvas, elementFactory, modeling) {

      // given
      var rootElement = canvas.getRootElement();

      // when
      var inputData = elementFactory.createShape({ type: 'dmn:InputData' });
      modeling.createShape(inputData, { x: 100, y: 100 }, rootElement);

      // then
      var variable = inputData.businessObject.variable;

      expect(variable).to.exist;
      expect(variable.typeRef).to.equal('Any');
      expect(variable.$parent).to.equal(inputData.businessObject);
    }
  ));


  it('should not create a variable for other shapes', inject(
    function(canvas, elementFactory, modeling) {

      // given
      var rootElement = canvas.getRootElement();

      // when
      var knowledgeSource = elementFactory.createShape({ type: 'dmn:KnowledgeSource' });
      modeling.createShape(knowledgeSource, { x: 100, y: 100 }, rootElement);

      // then
      expect(knowledgeSource.businessObject.variable).not.to.exist;
    }
  ));


  it('should not overwrite an existing variable', inject(
    function(canvas, drdFactory, elementFactory, modeling) {

      // given
      var rootElement = canvas.getRootElement(),
          businessObject = drdFactory.create('dmn:Decision', { name: 'Season' }),
          variable = drdFactory.create('dmn:InformationItem', { name: 'Season' });

      variable.$parent = businessObject;
      businessObject.variable = variable;

      // when
      var decision = elementFactory.createShape({
        type: 'dmn:Decision',
        businessObject: businessObject
      });
      modeling.createShape(decision, { x: 100, y: 100 }, rootElement);

      // then
      expect(decision.businessObject.variable).to.equal(variable);
      expect(decision.businessObject.variable.typeRef).not.to.exist;
    }
  ));


  it('should not create a variable when createElementsBehavior hint is false', inject(
    function(canvas, elementFactory, modeling) {

      // given
      var rootElement = canvas.getRootElement();

      // when
      var decision = elementFactory.createShape({ type: 'dmn:Decision' });
      modeling.createShape(decision, { x: 100, y: 100 }, rootElement, {
        createElementsBehavior: false
      });

      // then
      expect(decision.businessObject.variable).not.to.exist;
    }
  ));

});
