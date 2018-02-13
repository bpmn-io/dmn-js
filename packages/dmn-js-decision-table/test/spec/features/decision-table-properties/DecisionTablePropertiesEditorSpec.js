import { bootstrapModeler, inject } from 'test/helper';

import {
  classes as domClasses,
  query as domQuery
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import { triggerInputEvent } from 'dmn-js-shared/test/util/EventUtil';
import { queryEditor } from 'dmn-js-shared/test/util/EditorUtil';

import twoDecisionsXML from '../../two-decisions.dmn';

import CoreModule from 'lib/core';

import DecisionTablePropertiesModule
  from 'lib/features/decision-table-properties';

import DecisionTablePropertiesEditorModule
  from 'lib/features/decision-table-properties/editor';

import ModelingModule from 'lib/features/modeling';


describe('decision table properties', function() {

  beforeEach(bootstrapModeler(twoDecisionsXML, {
    modules: [
      CoreModule,
      DecisionTablePropertiesModule,
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
      triggerInputEvent(name, 'foo\nbar');

      name.blur();

      // then
      const root = sheet.getRoot();

      expect(root.businessObject.$parent.name).to.equal('foo\nbar');

      expect(name.innerHTML).to.equal('foo\nbar');
    }));


    it('should edit ID if valid', inject(function(sheet) {

      // given
      const id = queryEditor('.decision-table-id', testContainer);

      id.focus();

      // when
      triggerInputEvent(id, 'bar');

      // then
      const root = sheet.getRoot();

      expect(root.businessObject.$parent.id).to.equal('bar');
    }));


    it('should not edit ID if invalid', inject(function(sheet) {

      // given
      const id = queryEditor('.decision-table-id', testContainer);

      id.focus();

      // when
      triggerInputEvent(id, '!foo');

      // then
      const root = sheet.getRoot();

      expect(root.businessObject.$parent.id).to.equal('decision');
      expect(domClasses(id.parentNode).has('invalid')).to.be.true;
    }));

  });

});