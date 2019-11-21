import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import modelingModule from 'src/features/modeling';
import coreModule from 'src/core';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { find } from 'min-dash';


describe('features/modeling - create elements', function() {

  var testModules = [ coreModule, modelingModule ];

  var emptyDefsXML = require('../../../fixtures/dmn/empty-definitions.dmn');

  beforeEach(bootstrapModeler(emptyDefsXML, { modules: testModules }));


  function expectElement(element, attrs) {
    var businessObject = element.businessObject,
        extensionElements = businessObject.extensionElements;

    expect(element.type).to.equal(attrs.type);

    expect(businessObject).to.equal(attrs.businessObject);
    expect(businessObject.$parent).to.exist;

    expect(extensionElements.$parent).to.equal(businessObject);

    var bounds = find(extensionElements.get('values'), function(extensionElement) {
      return is(extensionElement, 'biodi:Bounds');
    });

    expect(bounds).to.have.bounds({
      x: element.x,
      y: element.y,
      width: attrs.width,
      height: attrs.height
    });

    expect(element.width).to.equal(attrs.width);
    expect(element.height).to.equal(attrs.height);
  }

  it('should create a decision', inject(
    function(canvas, drdFactory, elementFactory, modeling) {

      // given
      var rootElement = canvas.getRootElement(),
          businessObject = drdFactory.create('dmn:Decision', {
            name: 'Season'
          }),
          decision = elementFactory.createShape({
            type: 'dmn:Decision',
            businessObject: businessObject
          });

      // when
      modeling.createShape(decision, { x: 100, y: 100 }, rootElement);

      // then
      expectElement(decision, {
        type: 'dmn:Decision',
        width: 180,
        height: 80,
        businessObject: businessObject
      });
    }
  ));


  it('should create an input data', inject(
    function(canvas, drdFactory, elementFactory, modeling) {

      // given
      var rootElement = canvas.getRootElement(),
          businessObject = drdFactory.create('dmn:InputData', {
            name: 'Guests'
          }),
          inputData = elementFactory.createShape({
            type: 'dmn:InputData',
            businessObject: businessObject
          });

      // when
      modeling.createShape(inputData, { x: 100, y: 100 }, rootElement);

      // then
      expectElement(inputData, {
        type: 'dmn:InputData',
        width: 125,
        height: 45,
        businessObject: businessObject
      });
    }
  ));


  it('should create a knowledge source', inject(
    function(canvas, drdFactory, elementFactory, modeling) {

      // given
      var rootElement = canvas.getRootElement(),
          businessObject = drdFactory.create('dmn:KnowledgeSource', {
            name: 'How to?'
          }),
          knowledgeSource = elementFactory.createShape({
            type: 'dmn:KnowledgeSource',
            businessObject: businessObject
          });

      // when
      modeling.createShape(knowledgeSource, { x: 100, y: 100 }, rootElement);

      // then
      expectElement(knowledgeSource, {
        type: 'dmn:KnowledgeSource',
        width: 100,
        height: 63,
        businessObject: businessObject
      });
    }
  ));


  it('should create a business knowledge model', inject(
    function(canvas, drdFactory, elementFactory, modeling) {

      // given
      var rootElement = canvas.getRootElement(),
          businessObject = drdFactory.create('dmn:BusinessKnowledgeModel', {
            name: 'Plates'
          }),
          businessKnowledgeModel = elementFactory.createShape({
            type: 'dmn:BusinessKnowledgeModel',
            businessObject: businessObject
          });

      // when
      modeling.createShape(
        businessKnowledgeModel,
        { x: 100, y: 100 },
        rootElement
      );

      // then
      expectElement(businessKnowledgeModel, {
        type: 'dmn:BusinessKnowledgeModel',
        width: 135,
        height: 46,
        businessObject: businessObject
      });

    }
  ));


  it('should create a TextAnnotation', inject(
    function(canvas, drdFactory, elementFactory, modeling) {

      // given
      var rootElement = canvas.getRootElement(),
          businessObject = drdFactory.create('dmn:TextAnnotation', {
            text: 'Plates'
          }),
          textAnnotation = elementFactory.createShape({
            type: 'dmn:TextAnnotation',
            businessObject: businessObject
          });

      // when
      modeling.createShape(textAnnotation, { x: 100, y: 100 }, rootElement);

      // then
      expectElement(textAnnotation, {
        type: 'dmn:TextAnnotation',
        width: 100,
        height: 80,
        businessObject: businessObject
      });
    }
  ));

});
