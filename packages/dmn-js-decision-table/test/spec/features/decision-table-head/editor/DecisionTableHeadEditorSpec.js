import { bootstrapModeler } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import diagramXML from './DecisionTableHeadEditor.dmn';

import CoreModule from 'lib/core';
import DecisionTableHeadModule from 'lib/features/decision-table-head';
import DecisionTableHeadEditorModule from 'lib/features/decision-table-head/editor';
import ModelingModule from 'lib/features/modeling';


describe('decision-table-head/editor', function() {

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      DecisionTableHeadEditorModule,
      ModelingModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


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