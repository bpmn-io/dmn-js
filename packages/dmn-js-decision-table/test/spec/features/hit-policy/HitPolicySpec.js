import { bootstrapViewer } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from 'src/core';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import DecisionTablePropertiesModule from 'src/features/decision-table-properties';
import HitPolicyModule from 'src/features/hit-policy';


describe('features/hit-policy', function() {

  beforeEach(bootstrapViewer(simpleXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      DecisionTablePropertiesModule,
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