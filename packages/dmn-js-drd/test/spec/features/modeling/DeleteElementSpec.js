import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import modelingModule from 'src/features/modeling';
import coreModule from 'src/core';
import overlaysModule from 'diagram-js/lib/features/overlays';
import dataTypesModule from 'dmn-js-shared/lib/features/data-types';


describe('features/modeling - delete elements', function() {

  var testModules = [ coreModule, modelingModule, overlaysModule, dataTypesModule ];

  var inputDataXML = require('../../../fixtures/dmn/input-data.dmn');

  beforeEach(bootstrapModeler(inputDataXML, { modules: testModules }));


  describe('shape handling', function() {

    it('should execute', inject(function(elementRegistry, modeling) {

      // given
      var inputDataShape = elementRegistry.get('temperature_id'),
          inputData = inputDataShape.businessObject;

      // when
      modeling.removeShape(inputDataShape);

      // then
      expect(inputData.$parent).to.be.null;
    }));
  });


  describe('undo support', function() {

    it('should undo', inject(function(elementRegistry, modeling, commandStack) {

      // given
      var inputDataShape = elementRegistry.get('temperature_id'),
          inputData = inputDataShape.businessObject,
          parent = inputData.$parent;

      // when
      modeling.removeShape(inputDataShape);
      commandStack.undo();

      // then
      expect(inputData.$parent).to.eql(parent);
    }));
  });


  describe('redo support', function() {

    it('redo', inject(function(elementRegistry, modeling, commandStack) {

      // given
      var inputDataShape = elementRegistry.get('temperature_id'),
          inputData = inputDataShape.businessObject;

      // when
      modeling.removeShape(inputDataShape);
      commandStack.undo();
      commandStack.redo();

      // then
      expect(inputData.$parent).to.be.null;
    }));
  });

});
