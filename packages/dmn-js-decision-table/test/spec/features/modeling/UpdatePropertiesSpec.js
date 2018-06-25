import { bootstrapModeler, inject } from 'test/helper';

import modelingXML from './modeling.dmn';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';


// TODO(nikku): move test to dmn-js-shared

describe('modeling/cmd - update properties', function() {

  beforeEach(bootstrapModeler(modelingXML, {
    modules: [
      CoreModule,
      ModelingModule
    ]
  }));


  describe('should change properties', function() {

    it('execute', inject(function(modeling, sheet) {

      // given
      var inputCol = sheet.getRoot().cols[0];
      var input = inputCol.businessObject;

      // when
      modeling.updateProperties(inputCol, {
        label: 'foo',
        inputExpression: {
          text: 'bar'
        }
      });

      // then
      expect(input.label).to.eql('foo');
      expect(input.inputExpression.text).to.eql('bar');
    }));


    it('undo', inject(function(modeling, sheet, commandStack) {

      // given
      var inputCol = sheet.getRoot().cols[0];
      var input = inputCol.businessObject;

      // when
      modeling.updateProperties(inputCol, {
        label: 'foo',
        inputExpression: {
          text: 'bar'
        }
      });

      commandStack.undo();

      // then
      expect(input.label).to.eql('Customer Status');
      expect(input.inputExpression.text).to.eql('status');
    }));


    it('should redo', inject(function(modeling, sheet, commandStack) {

      // given
      var inputCol = sheet.getRoot().cols[0];
      var input = inputCol.businessObject;

      // when
      modeling.updateProperties(inputCol, {
        label: 'foo',
        inputExpression: {
          text: 'bar'
        }
      });

      commandStack.undo();
      commandStack.redo();

      // then
      expect(input.label).to.eql('foo');
      expect(input.inputExpression.text).to.eql('bar');
    }));

  });


  describe('should unset property', function() {

    it('execute', inject(function(modeling, sheet) {

      // given
      var inputCol = sheet.getRoot().cols[0];
      var input = inputCol.businessObject;

      // when
      modeling.updateProperties(inputCol, {
        label: undefined
      });

      // then
      expect(input.label).not.to.exist;
    }));


    it('undo', inject(function(modeling, sheet, commandStack) {

      // given
      var inputCol = sheet.getRoot().cols[0];
      var input = inputCol.businessObject;

      // when
      modeling.updateProperties(inputCol, {
        label: undefined
      });


      commandStack.undo();

      // then
      expect(input.label).to.eql('Customer Status');
    }));


    it('should redo', inject(function(modeling, sheet, commandStack) {

      // given
      var inputCol = sheet.getRoot().cols[0];
      var input = inputCol.businessObject;

      // when
      modeling.updateProperties(inputCol, {
        label: undefined
      });

      commandStack.undo();
      commandStack.redo();

      // then
      expect(input.label).not.to.exist;
    }));

  });


  describe('should add extension property', function() {

    it('execute', inject(function(modeling, sheet) {

      // given
      var inputCol = sheet.getRoot().cols[0];
      var input = inputCol.businessObject;

      // when
      modeling.updateProperties(inputCol, {
        'camunda:inputVariable': 'foo'
      });

      // then
      expect(input.get('camunda:inputVariable')).to.eql('foo');
    }));


    it('undo', inject(function(modeling, sheet, commandStack) {

      // given
      var inputCol = sheet.getRoot().cols[0];
      var input = inputCol.businessObject;

      // when
      modeling.updateProperties(inputCol, {
        'camunda:inputVariable': 'foo'
      });

      commandStack.undo();

      // then
      expect(input.get('camunda:inputVariable')).not.to.exist;
    }));


    it('should redo', inject(function(modeling, sheet, commandStack) {

      // given
      var inputCol = sheet.getRoot().cols[0];
      var input = inputCol.businessObject;

      // when
      modeling.updateProperties(inputCol, {
        'camunda:inputVariable': 'foo'
      });

      commandStack.undo();
      commandStack.redo();

      // then
      expect(input.get('camunda:inputVariable')).to.eql('foo');
    }));

  });


  describe('should throw on non-existing container', function() {

    it('execute', inject(function(modeling, sheet) {

      // given
      var inputCol = sheet.getRoot().cols[0];

      // then
      expect(() => {

        modeling.updateProperties(inputCol, {
          foo: {
            bar: 'bar'
          }
        });

      }).to.throw('non-existing property <foo>: cannot update values');

    }));

  });

});