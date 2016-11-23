'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */

var booleanXML = require('../../../../fixtures/dmn/boolean.dmn');
var drdXML = require('../../../../fixtures/dmn/di.dmn');

describe('features/modeling', function() {

  var modeler;

  describe('table interaction', function() {
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
          expect(xml).to.include('<description>This is a description</description>');
        });
      }));

    });

    describe('input values', function() {
      describe('add', function() {
        var businessObject;

        beforeEach(inject(function(elementRegistry) {
          businessObject = elementRegistry.get('cell_input1_typeRow');
        }));

        it('should set input values for a column', inject(function(modeling) {
          // when
          modeling.addAllowedValue(businessObject, 'inputValue');

          // then
          expect(businessObject.content.inputValues.text).to.include('inputValue');
        }));


        it('should undo', inject(function(modeling, commandStack) {
          // given
          modeling.addAllowedValue(businessObject, 'inputValue');

          // when
          commandStack.undo();

          // then
          expect(businessObject.content.inputValues.text).to.be.empty;
        }));


        it('should redo', inject(function(modeling, commandStack) {
          // given
          modeling.addAllowedValue(businessObject, 'inputValue');
          commandStack.undo();

          // when
          commandStack.redo();

          // then
          expect(businessObject.content.inputValues.text).to.include('inputValue');
        }));


        it('should persist the change in the xml', inject(function(modeling) {
          // given
          modeling.addAllowedValue(businessObject, 'inputValue');

          // when
          modeler.saveXML(function(err, xml) {
            expect(xml).to.include('<text><![CDATA["inputValue"]]></text>');
          });
        }));
      });

      describe('remove', function() {
        var businessObject;

        beforeEach(inject(function(elementRegistry, modeling) {
          businessObject = elementRegistry.get('cell_input1_typeRow');
          modeling.addAllowedValue(businessObject, 'inputValue');
        }));

        it('should remove input values for a column', inject(function(modeling) {
          // when
          modeling.removeAllowedValue(businessObject, 'inputValue');

          // then
          expect(businessObject.content.inputValues.text).to.be.empty;
        }));


        it('should undo', inject(function(modeling, commandStack) {
          // given
          modeling.removeAllowedValue(businessObject, 'inputValue');

          // when
          commandStack.undo();

          // then
          expect(businessObject.content.inputValues.text).to.include('inputValue');
        }));


        it('should redo', inject(function(modeling, commandStack) {
          // given
          modeling.removeAllowedValue(businessObject, 'inputValue');
          commandStack.undo();

          // when
          commandStack.redo();

          // then
          expect(businessObject.content.inputValues.text).to.be.empty;
        }));


        it('should persist the change in the xml', inject(function(modeling) {
          // given
          modeling.removeAllowedValue(businessObject, 'inputValue');

          // when
          modeler.saveXML(function(err, xml) {
            expect(xml).to.include('<text></text>');
          });
        }));
      });
    });
  });

  describe('drd interaction', function() {
    beforeEach(function(done) {
      modeler = bootstrapModeler(drdXML)(function() {
        modeler.showDecision(modeler.getDecisions()[1]);
        done();
      });
    });

    describe('decision-id', function() {

      it('should update required decisions', inject(function(modeling) {
        // given

        // when
        modeling.editId('myNewShinyId');

        // then
        expect(modeler.getDecisions()[0].informationRequirement[0].requiredDecision.href).to.eql('#myNewShinyId');
      }));

      it('should update required decisions for authorityRequirements', inject(function(modeling) {
        // given
        modeler.showDecision(modeler.getDecisions()[2]);

        // when
        modeling.editId('newAuthorityId');

        // then
        expect(modeler.definitions.drgElements[3].authorityRequirement[0].requiredDecision.href).to.eql('#newAuthorityId');
      }));


      it('should undo', inject(function(modeling, commandStack) {
        // given
        modeling.editId('myNewShinyId');

        // when
        commandStack.undo();

        // then
        expect(modeler.getDecisions()[0].informationRequirement[0].requiredDecision.href).to.eql('#season');
      }));


      it('should redo', inject(function(modeling, commandStack) {
        // given
        modeling.editId('myNewShinyId');
        commandStack.undo();

        // when
        commandStack.redo();

        // then
        expect(modeler.getDecisions()[0].informationRequirement[0].requiredDecision.href).to.eql('#myNewShinyId');
      }));

      it('should persist the change in the xml', inject(function(modeling) {
        // given
        modeling.editId('myNewShinyId');

        // when
        modeler.saveXML(function(err, xml) {

          // then
          expect(xml).to.include('#myNewShinyId');

        });
      }));


    });
  });

});
