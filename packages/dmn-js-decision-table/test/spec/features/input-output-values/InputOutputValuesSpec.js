import { bootstrapModeler, inject } from 'test/helper';

import { triggerChangeEvent, triggerKeyEvent, triggerMouseEvent } from 'test/util/EventUtil';

import { classes as domClasses, query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import inputOutputValuesXML from '../../input-output-values.dmn';

import CoreModule from 'lib/core';
import DecisionTableHeadModule from 'lib/features/decision-table-head';
import InputOutputValuesModule from 'lib/features/input-output-values';


describe('input output values', function() {

  beforeEach(bootstrapModeler(inputOutputValuesXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      InputOutputValuesModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {    
    testContainer = TestContainer.get(this);
  });


  describe('input values', function() {

    let inputValuesEdit;

    beforeEach(function() {
      const cell = domQuery('.input.type-ref', testContainer);
      
      triggerMouseEvent(cell, 'click');
  
      inputValuesEdit = domQuery('.input-output-values-edit', testContainer);
    });


    it('should render input values', function() {
              
      // then
      expectValuesRendered(inputValuesEdit, [
        '"bronze"',
        '"silver"',
        '"gold"'
      ]);
    });


    it('should add value', inject(function(elementRegistry) {

      // when
      const input = domQuery('.input', inputValuesEdit);

      input.focus();

      input.value = '"foo"';
      
      // press ""
      triggerKeyEvent(input, 'keyup', 50);

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expectValuesRendered(inputValuesEdit, [
        '"bronze"',
        '"silver"',
        '"gold"',
        '"foo"'
      ]);

      expect(elementRegistry.get('input1').businessObject.inputValues.text)
        .to.equal('"bronze","silver","gold","foo"');
    }));


    it('should add multiple values', inject(function(elementRegistry) {

      // when
      const input = domQuery('.input', inputValuesEdit);

      input.focus();

      input.value = '"foo", "bar"';
      
      // press ""
      triggerKeyEvent(input, 'keyup', 50);

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expectValuesRendered(inputValuesEdit, [
        '"bronze"',
        '"silver"',
        '"gold"',
        '"foo"',
        '"bar"'
      ]);

      expect(elementRegistry.get('input1').businessObject.inputValues.text)
        .to.equal('"bronze","silver","gold","foo","bar"');
    }));


    it('should remove value - simple', inject(function(elementRegistry) {

      // when
      const value = domQuery('.value', inputValuesEdit);
      
      triggerMouseEvent(value, 'mouseup');

      // then
      expectValuesRendered(inputValuesEdit, [
        '"silver"',
        '"gold"'
      ]);

      expect(elementRegistry.get('input1').businessObject.inputValues.text)
        .to.equal('"silver","gold"');
    }));


    it('should validate value', inject(function(elementRegistry) {

      // when
      const input = domQuery('.input', inputValuesEdit);
      
      input.focus();

      input.value = '"foo';
      
      // press o
      triggerKeyEvent(input, 'keyup', 79);

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expect(domClasses(input).has('invalid')).to.be.true;

      expectValuesRendered(inputValuesEdit, [
        '"bronze"',
        '"silver"',
        '"gold"'
      ]);

      expect(elementRegistry.get('input1').businessObject.inputValues.text)
        .to.equal('"bronze","silver","gold"');
    }));


    it('should delete allowed values when type is changed to anything but string',
      inject(function(elementRegistry) {
        
        // given
        const select = domQuery('.type-ref-edit-select', testContainer);
        
        // when
        triggerChangeEvent(select, 'boolean');

        // then
        expect(elementRegistry.get('input1').businessObject.inputValues).not.to.exist;
      }));

  });


  describe('output values', function() {

    let outputValuesEdit;

    beforeEach(function() {
      const cell = domQuery('.output.type-ref', testContainer);
      
      triggerMouseEvent(cell, 'click');
  
      outputValuesEdit = domQuery('.input-output-values-edit', testContainer);
    });


    it('should render output values', function() {
          
      // then
      expectValuesRendered(outputValuesEdit, [
        '"ok"',
        '"notok"'
      ]);
    });
    

    it('should add value', inject(function(elementRegistry) {
      
      // when
      const input = domQuery('.input', outputValuesEdit);

      input.focus();

      input.value = '"foo"';
      
      // press ""
      triggerKeyEvent(input, 'keyup', 50);

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expectValuesRendered(outputValuesEdit, [
        '"ok"',
        '"notok"',
        '"foo"'
      ]);

      expect(elementRegistry.get('output1').businessObject.outputValues.text)
        .to.equal('"ok","notok","foo"');
    }));


    it('should add multiple values', inject(function(elementRegistry) {

      // when
      const input = domQuery('.input', outputValuesEdit);

      input.focus();

      input.value = '"foo", "bar"';
      
      // press ""
      triggerKeyEvent(input, 'keyup', 50);

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expectValuesRendered(outputValuesEdit, [
        '"ok"',
        '"notok"',
        '"foo"',
        '"bar"'
      ]);

      expect(elementRegistry.get('output1').businessObject.outputValues.text)
        .to.equal('"ok","notok","foo","bar"');
    }));


    it('should remove value', inject(function(elementRegistry) {

      // when
      const value = domQuery('.value', outputValuesEdit);
      
      triggerMouseEvent(value, 'mouseup');

      // then
      expectValuesRendered(outputValuesEdit, [
        '"notok"'
      ]);

      expect(elementRegistry.get('output1').businessObject.outputValues.text)
        .to.equal('"notok"');
    }));


    it('should validate value', inject(function(elementRegistry) {

      // when
      const input = domQuery('.input', outputValuesEdit);
      
      input.focus();

      input.value = '"foo';

      // press o
      triggerKeyEvent(input, 'keyup', 79);

      // press ENTER
      triggerKeyEvent(input, 'keydown', 13);

      // then
      expect(domClasses(input).has('invalid')).to.be.true;

      expectValuesRendered(outputValuesEdit, [
        '"ok"',
        '"notok"'
      ]);

      expect(elementRegistry.get('output1').businessObject.outputValues.text)
        .to.equal('"ok","notok"');
    }));


    it('should delete allowed values when type is changed to anything but string',
      inject(function(elementRegistry) {
        
        // given
        const select = domQuery('.type-ref-edit-select', testContainer);
        
        // when
        triggerChangeEvent(select, 'boolean');

        // then
        expect(elementRegistry.get('output1').outputValues).not.to.exist;
      }));
            
  });

});

////////// helpers //////////

function expectValuesRendered(element, expected) {
  const values = Array.from(domQuery.all('.value', element));

  values.forEach((value, index) => {
    expect(value.textContent).to.equal(expected[index]);
  });
}