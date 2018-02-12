import { bootstrapViewer, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from 'lib/core';
import RulesModule from 'lib/features/rules';

describe('rules', function() {

  beforeEach(bootstrapViewer(simpleXML, {
    modules: [
      CoreModule,
      RulesModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render body', function() {

    // then
    expect(domQuery('tbody', testContainer)).to.exist;
  });


  it('should allow rendering before rule', inject(function(components, eventBus, sheet) {

    // given
    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'before-rule-cells') {
        return () => <td className="foo">FOO</td>;
      }
    });

    const root = sheet.getRoot();

    // when
    eventBus.fire('elements.changed', { elements: [ root ] });

    // then
    expect(domQuery('.foo', testContainer)).to.exist;
  }));


  it('should allow rendering after rule', inject(function(components, eventBus, sheet) {

    // given
    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'after-rule-cells') {
        return () => <td className="foo">FOO</td>;
      }
    });

    const root = sheet.getRoot();

    // when
    eventBus.fire('elements.changed', { elements: [ root ] });

    // then
    expect(domQuery('.foo', testContainer)).to.exist;
  }));

});