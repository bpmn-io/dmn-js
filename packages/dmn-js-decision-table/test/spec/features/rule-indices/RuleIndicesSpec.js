require('../../../TestHelper');

/* global bootstrapModeler, inject */

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from '../../../../lib/core';
import ModelingModule from '../../../../lib/features/modeling';
import RulesModule from '../../../../lib/features/rules';
import RuleIndicesModule from '../../../../lib/features/rule-indices';

function expectIndices(cells) {
  Array.from(cells).forEach((cell, index) => {
    expect(parseInt(cell.textContent)).to.equal(index);
  });
}


describe('RuleIndices', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      ModelingModule,
      RulesModule,
      RuleIndicesModule
    ]
  }));

  let testContainer;

  beforeEach(function() {    
    testContainer = TestContainer.get(this);
  });


  it('should display rule indices', function() {

    // then
    const cells = domQuery.all('.rule-index', testContainer);

    expect(cells).to.have.lengthOf(4);

    expectIndices(cells);
  });

  
  it('should update rule indices on rule added', inject(function(modeling) {

    // when
    modeling.addRow({ type: 'dmn:DecisionRule' });
    
    // then
    const cells = domQuery.all('.rule-index', testContainer);

    expect(cells).to.have.lengthOf(5);

    expectIndices(cells);
  }));


  it('should update rule indices on rule removed', inject(function(modeling, sheet) {

    // given
    var table = sheet.getRoot();
    var row = table.rows[0];

    // when
    modeling.removeRow(row);
    
    // then
    const cells = domQuery.all('.rule-index', testContainer);

    expect(cells).to.have.lengthOf(3);

    expectIndices(cells);
  }));

});