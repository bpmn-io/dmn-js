require('../../../TestHelper');

/* global bootstrapModeler, inject */

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import { triggerInputEvent } from '../../../util/EventUtil';

import simpleXML from '../../simple.dmn';

import AnnotationsEditorModule from '../../../../lib/features/annotations/editor';
import CoreModule from '../../../../lib/core';
import DecisionTableHeadModule from '../../../../lib/features/decision-table-head';
import RulesModule from '../../../../lib/features/rules';


describe('annotations editor', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      AnnotationsEditorModule,
      CoreModule,
      DecisionTableHeadModule,
      RulesModule
    ],
    debounceOnInput: false
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
    expect(cells[3].textContent).to.equal('Gold is really good, try even harder next time though');
  });


  it('should select text on focus', function() {

    // given
    const cell = domQuery('td.annotation', testContainer);

    // when
    cell.focus();
  });


  it('should unselect text on blur', function() {

    // given
    const cell = domQuery('td.annotation', testContainer);
    
    cell.focus();
    
    // when
    cell.blur();
  });


  it('should edit annotation', inject(function(sheet) {

    // given
    const cell = domQuery('td.annotation', testContainer);
    
    // when
    cell.focus();

    triggerInputEvent(cell, 'foo');

    // then
    const root = sheet.getRoot();

    const rule = root.businessObject.rule[0];

    expect(rule.description).to.equal('foo');
  }));

});