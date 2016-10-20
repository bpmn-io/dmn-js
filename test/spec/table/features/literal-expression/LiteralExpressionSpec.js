'use strict';

require('../../TestHelper');

var DOMEvents = require('table-js/test/util/DOMEvents'),
    createEvent = DOMEvents.createEvent;

/* global bootstrapModeler, inject */

var basicXML = require('../../../../fixtures/dmn/literal-expression.dmn');

describe('features/literal-expression', function() {
  var modeler;

  beforeEach(function(done) {
    modeler = bootstrapModeler(basicXML)(done);
  });

  it('should should show the literal expression editor', inject(function(sheet) {
    expect(sheet.getContainer().querySelector('.literal-expression-editor')).to.exist;
  }));

  it('should render the literal expression text', inject(function(sheet) {
    expect(sheet.getContainer().querySelector('textarea').value).to.eql('calendar.getSeason(date)');
  }));

  it('should render variable name and type', inject(function(sheet) {
    expect(sheet.getContainer().querySelector('.variable-name').value).to.eql('season');
    expect(sheet.getContainer().querySelector('.variable-type input').value).to.eql('string');
  }));

  it('should render expression language', inject(function(sheet) {
    expect(sheet.getContainer().querySelector('.expression-language input').value).to.eql('Javascript');
  }));

  describe('modeling', function() {
    var businessObject;

    beforeEach(inject(function(elementRegistry) {
      businessObject = modeler.getDecisions()[0];
    }));

    it('should set the literal expression', inject(function(modeling) {
      // when
      modeling.editLiteralExpression(businessObject, 'myNewLiteralExpression', 'varName', 'string', 'Javascript');

      // then
      expect(businessObject.literalExpression.text).to.eql('myNewLiteralExpression');
    }));

    it('should get the correct expression language from the input field', inject(function(sheet) {
      // when
      var target = sheet.getContainer().querySelector('.expression-language input');
      target.value = 'Brainfuck';
      createEvent('input', target);

      modeler.saveXML(function(err, xml) {
        // then
        expect(xml).to.include('Brainfuck');
      });
    }));


    it('should undo', inject(function(modeling, commandStack) {
      // given
      modeling.editLiteralExpression(businessObject, 'myNewLiteralExpression', 'varName', 'string', 'Javascript');

      // when
      commandStack.undo();

      // then
      expect(businessObject.literalExpression.text).to.eql('calendar.getSeason(date)');
    }));


    it('should redo', inject(function(modeling, commandStack) {
      // given
      modeling.editLiteralExpression(businessObject, 'myNewLiteralExpression', 'varName', 'string', 'Javascript');
      commandStack.undo();

      // when
      commandStack.redo();

      // then
      expect(businessObject.literalExpression.text).to.eql('myNewLiteralExpression');
    }));


    it('should persist the change in the xml', inject(function(modeling) {
      // given
      modeling.editLiteralExpression(businessObject, 'myNewLiteralExpression', 'varName', 'string', 'Javascript');

      // when
      modeler.saveXML(function(err, xml) {
        expect(xml).to.include('<text>myNewLiteralExpression</text>');
      });
    }));
  });

});
