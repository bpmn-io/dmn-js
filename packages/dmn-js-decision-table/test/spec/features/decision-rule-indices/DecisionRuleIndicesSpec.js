import { bootstrapModeler, inject } from 'test/helper';

import {
  queryAll as domQueryAll
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from 'lib/core';
import ModelingModule from 'lib/features/modeling';
import DecisionRulesModule from 'lib/features/decision-rules';
import DecisionRuleIndicesModule from 'lib/features/decision-rule-indices';


describe('decision rule indices', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      ModelingModule,
      DecisionRulesModule,
      DecisionRuleIndicesModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should display decision rule indices', function() {

    // then
    const cells = domQueryAll('.rule-index', testContainer);

    expect(cells).to.have.lengthOf(4);

    expectIndices(cells);
  });


  it('should update decision rule indices on rule added', inject(function(modeling) {

    // when
    modeling.addRow({ type: 'dmn:DecisionRule' });

    // then
    const cells = domQueryAll('.rule-index', testContainer);

    expect(cells).to.have.lengthOf(5);

    expectIndices(cells);
  }));


  it('should update decision rule indices on rule removed',
    inject(function(modeling, sheet) {

      // given
      var table = sheet.getRoot();
      var row = table.rows[0];

      // when
      modeling.removeRow(row);

      // then
      const cells = domQueryAll('.rule-index', testContainer);

      expect(cells).to.have.lengthOf(3);

      expectIndices(cells);
    }));

});


// helpers //////////////

function expectIndices(cells) {
  arrayFromNodeList(cells).forEach((cell, index) => {
    expect(parseInt(cell.textContent)).to.equal(index + 1);
  });
}

function arrayFromNodeList(nodeList) {
  return [].slice.call(nodeList);
}