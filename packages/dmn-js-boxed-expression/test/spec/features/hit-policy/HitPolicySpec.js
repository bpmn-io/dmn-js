import { expect } from 'chai';
import { bootstrapViewer } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import DecisionTableModule from 'src/features/decision-table';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import HitPolicyModule from 'src/features/hit-policy';


describe('features/hit-policy', function() {

  beforeEach(bootstrapViewer(simpleXML, {
    modules: [
      DecisionTableModule,
      DecisionTableHeadModule,
      HitPolicyModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render hit policy cell', function() {

    // then
    expect(domQuery('.hit-policy', testContainer)).to.exist;
  });

});