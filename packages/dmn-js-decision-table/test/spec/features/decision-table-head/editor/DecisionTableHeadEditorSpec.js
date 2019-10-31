import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import diagramXML from './DecisionTableHeadEditor.dmn';

import CoreModule from 'src/core';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import DecisionTableHeadEditorModule from 'src/features/decision-table-head/editor';
import ModelingModule from 'src/features/modeling';


describe('decision-table-head/editor', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('rendering', function() {

    beforeEach(bootstrapModeler(diagramXML, {
      modules: [
        CoreModule,
        DecisionTableHeadModule,
        DecisionTableHeadEditorModule,
        ModelingModule
      ],
      debounceInput: false
    }));


    it('should render output name', function() {

      // when
      const nameEl = domQuery('.output-name', testContainer);

      // then
      expect(nameEl).to.exist;
      expect(nameEl.textContent).to.eql('reason');
    });


    it('should render output label', function() {

      // when
      const labelEl = domQuery('.output-label', testContainer);

      // then
      expect(labelEl).to.exist;
      expect(labelEl.textContent).to.eql('Check Result');
    });


    it('should render input expression', function() {

      // when
      const expressionEl = domQuery('.input-expression', testContainer);

      // then
      expect(expressionEl).to.exist;
      expect(expressionEl.textContent).to.eql('sum');
    });


    it('should render input label', function() {

      // when
      const labelEl = domQuery('.input-label', testContainer);

      // then
      expect(labelEl).to.exist;
      expect(labelEl.textContent).to.eql('Customer Status');
    });
  });


  describe('updating values', function() {

    beforeEach(bootstrapModeler(diagramXML, {
      modules: [
        CoreModule,
        DecisionTableHeadModule,
        DecisionTableHeadEditorModule,
        ModelingModule,
        {
          debounceInput: [ 'factory', flushableDebounceInputFactory ]
        }
      ],
    }));


    it('should correctly display erased input expression', inject(
      function(debounceInput) {

        // given
        const inputCell = domQuery('th[data-col-id="input2"]', testContainer);
        inputCell.click();

        const input = domQuery('.ref-input-label', testContainer);

        setValue(input, 'to-erase');
        debounceInput.flush();

        // when
        setValue(input, '');

        // then
        expect(input.value).to.eql('');
      })
    );


    it('should correctly display erased output expression', inject(
      function(debounceInput) {

        // given
        const outputCell = domQuery('th[data-col-id="output2"]', testContainer);
        outputCell.click();

        const input = domQuery('.ref-output-label', testContainer);

        setValue(input, 'to-erase');
        debounceInput.flush();

        // when
        setValue(input, '');

        // then
        expect(input.value).to.eql('');
      })
    );
  });
});


// helper ////
function flushableDebounceInputFactory() {
  return function debounce(fn) {
    let lastArgs, lastThis;

    debounce.flush = function() {
      fn.apply(lastThis, lastArgs);
    };

    return function(...args) {
      lastArgs = args;
      lastThis = this;
    };
  };
}

function setValue(element, value) {
  const event = new Event('input');

  element.value = value;
  element.dispatchEvent(event);
}
