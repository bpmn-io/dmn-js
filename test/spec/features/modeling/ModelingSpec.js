'use strict';

require('../../../TestHelper');

/* global bootstrapModeler, inject */

var booleanXML = require('../../../fixtures/dmn/boolean.dmn');

describe('features/modeling', function() {

  var modeler;

  beforeEach(function(done) {
    modeler = bootstrapModeler(booleanXML)(done);
  });

  describe('cellExpressionLanguage', function() {
    var businessObject;

    beforeEach(inject(function(elementRegistry) {
      businessObject = elementRegistry.get('cell_input1_rule1').content;
    }));

    it('should set the expression language for a cell', inject(function(modeling) {
      // when
      modeling.editCellExpressionLanguage(businessObject, 'myScriptLanguage');

      // then
      expect(businessObject.expressionLanguage).to.eql('myScriptLanguage');
    }));


    it('should undo', inject(function(modeling, commandStack) {
      // given
      modeling.editCellExpressionLanguage(businessObject, 'myScriptLanguage');

      // when
      commandStack.undo();

      // then
      expect(businessObject.expressionLanguage).to.not.exist;
    }));


    it('should redo', inject(function(modeling, commandStack) {
      // given
      modeling.editCellExpressionLanguage(businessObject, 'myScriptLanguage');
      commandStack.undo();

      // when
      commandStack.redo();

      // then
      expect(businessObject.expressionLanguage).to.eql('myScriptLanguage');
    }));


    it('should persist the change in the xml', inject(function(modeling) {
      // given
      modeling.editCellExpressionLanguage(businessObject, 'myScriptLanguage');

      // when
      modeler.saveXML(function(err, xml) {
        expect(xml).to.include('expressionLanguage="myScriptLanguage"');
      });
    }));

  });

  describe('description', function() {
    var businessObject;

    beforeEach(inject(function(elementRegistry) {
      businessObject = elementRegistry.get('cell_input1_rule1').content;
    }));

    it('should set the description for a cell', inject(function(modeling) {
      // when
      modeling.editDescription(businessObject, 'this is a descriptive comment');

      // then
      expect(businessObject.description).to.eql('this is a descriptive comment');
    }));


    it('should undo', inject(function(modeling, commandStack) {
      // given
      modeling.editDescription(businessObject, 'description');

      // when
      commandStack.undo();

      // then
      expect(businessObject.description).to.not.exist;
    }));


    it('should redo', inject(function(modeling, commandStack) {
      // given
      modeling.editDescription(businessObject, 'description');
      commandStack.undo();

      // when
      commandStack.redo();

      // then
      expect(businessObject.description).to.eql('description');
    }));


    it('should persist the change in the xml', inject(function(modeling) {
      // given
      modeling.editDescription(businessObject, 'This is a description');

      // when
      modeler.saveXML(function(err, xml) {
        expect(xml).to.include('<dmn:description>This is a description</dmn:description>');
      });
    }));

  });

});
