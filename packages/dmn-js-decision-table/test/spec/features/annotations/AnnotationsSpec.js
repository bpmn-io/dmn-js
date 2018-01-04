require('../../../TestHelper');

/* global bootstrapViewer */

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import AnnotationsModule from '../../../../lib/features/annotations';
import CoreModule from '../../../../lib/core';
import DecisionTableHeadModule from '../../../../lib/features/decision-table-head';
import RulesModule from '../../../../lib/features/rules';


describe('annotations', function() {

  beforeEach(bootstrapViewer(simpleXML, {
    modules: [
      AnnotationsModule,
      CoreModule,
      DecisionTableHeadModule,
      RulesModule
    ]
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

});