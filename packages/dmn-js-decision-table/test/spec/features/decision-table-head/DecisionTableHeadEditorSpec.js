import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import { triggerInputEvent } from 'dmn-js-shared/test/util/EventUtil';
import { queryEditor } from 'dmn-js-shared/test/util/EditorUtil';

import simpleXML from '../../simple.dmn';

import CoreModule from 'lib/core';
import DecisionTableHeadModule from 'lib/features/decision-table-head';
import DecisionTableHeadEditorModule from 'lib/features/decision-table-head/editor';
import ModelingModule from 'lib/features/modeling';


describe('decision table head editor', function() {

  beforeEach(bootstrapModeler(simpleXML, {
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

    // then
    expect(domQuery('.output-name', testContainer)).to.exist;
  });


  describe('output name editing', function() {

    it('should edit output name', inject(function(sheet) {

      // given
      const outputName = queryEditor('.output-name', testContainer);

      outputName.focus();

      // when
      triggerInputEvent(outputName, 'foo');

      // then
      const root = sheet.getRoot();

      const output = root.businessObject.output[0];

      expect(output.name).to.equal('foo');
    }));


    it('should edit output name - line break', inject(function(sheet) {

      // given
      const outputName = queryEditor('.output-name', testContainer);

      outputName.focus();

      // when
      triggerInputEvent(outputName, 'foo\nbar');

      outputName.blur();

      // then
      const root = sheet.getRoot();

      const output = root.businessObject.output[0];

      expect(output.name).to.equal('foo\nbar');

      expect(outputName.innerText).to.equal('foo\nbar');
    }));

  });

});