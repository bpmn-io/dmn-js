import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import { triggerInputEvent } from 'dmn-js-shared/test/util/EventUtil';
import { queryEditor } from 'dmn-js-shared/test/util/EditorUtil';

import simpleXML from '../../simple.dmn';

import AnnotationsEditorModule from 'lib/features/annotations/editor';
import CoreModule from 'lib/core';
import DecisionTableHeadModule from 'lib/features/decision-table-head';
import ModelingModule from 'lib/features/modeling';
import RulesModule from 'lib/features/rules';


describe('annotations editor', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      AnnotationsEditorModule,
      CoreModule,
      DecisionTableHeadModule,
      ModelingModule,
      RulesModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render annotation head cell', function() {

    // then
    expect(domQuery('th.annotation', testContainer)).to.exist;
  });


  it('should render annotation cells', function() {

    // then
    const cells = domQuery.all('td.annotation', testContainer);

    expect(cells).to.have.lengthOf(4);
    expect(cells[0].textContent).to.equal('Bronze is really not that good');
    expect(cells[1].textContent).to.equal('Silver is actually quite okay');
    expect(cells[2].textContent).to.equal('Same here');
    expect(cells[3].textContent).to.equal(
      'Gold is really good, try even harder next time though'
    );
  });


  it('should edit annotation', inject(function(sheet) {

    // given
    const cell = queryEditor('td.annotation', testContainer);

    // when
    cell.focus();

    triggerInputEvent(cell, 'foo');

    // then
    const root = sheet.getRoot();

    const rule = root.businessObject.rule[0];

    expect(rule.description).to.equal('foo');
  }));


  it('should edit annotation - line break', inject(function(sheet) {

    // given
    const cell = queryEditor('td.annotation', testContainer);

    // when
    cell.focus();

    triggerInputEvent(cell, 'foo\nbar');

    cell.blur();

    // then
    const root = sheet.getRoot();

    const rule = root.businessObject.rule[0];

    expect(rule.description).to.equal('foo\nbar');

    expect(cell.innerText).to.equal('foo\nbar');
  }));

});