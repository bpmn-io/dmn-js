import { bootstrapViewer } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from 'src/core';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import DecisionTablePropertiesModule from 'src/features/decision-table-properties';

describe('decision table properties', function() {

  beforeEach(bootstrapViewer(simpleXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      DecisionTablePropertiesModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render decision table properties', function() {

    // then
    expect(domQuery('.decision-table-properties', testContainer)).to.exist;
  });

});