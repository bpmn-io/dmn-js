import { bootstrapModeler, inject } from 'test/helper';

import {
  query as domQuery
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import { triggerInputEvent } from 'dmn-js-shared/test/util/EventUtil';
import { queryEditor } from 'dmn-js-shared/test/util/EditorUtil';

import twoDecisionsXML from '../../two-decisions.dmn';

import CoreModule from 'src/core';

import DecisionTableHeadModule from 'src/features/decision-table-head';

import DecisionTablePropertiesEditorModule
  from 'src/features/decision-table-properties/editor';

import ModelingModule from 'src/features/modeling';


describe('decision table properties', function() {

  beforeEach(bootstrapModeler(twoDecisionsXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      DecisionTablePropertiesEditorModule,
      ModelingModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render decision table properties', function() {

    // then
    expect(domQuery('.decision-table-properties', testContainer)).to.exist;
  });


  describe('decision table property editing', function() {

    it('should edit name', inject(function(sheet) {

      // given
      const name = queryEditor('.decision-table-name', testContainer);

      name.focus();

      // when
      triggerInputEvent(name, 'foo');

      // then
      const root = sheet.getRoot();

      expect(root.businessObject.$parent.name).to.equal('foo');
    }));


    it('should edit name - line breaks', inject(function(sheet) {

      // given
      const name = queryEditor('.decision-table-name', testContainer);

      name.focus();

      // when
      triggerInputEvent(name, 'foo<br>bar<br>');

      name.blur();

      // then
      const root = sheet.getRoot();

      expect(root.businessObject.$parent.name).to.equal('foo\nbar');

      expect(name.innerHTML).to.equal('foo<br>bar<br>');
    }));

  });

});