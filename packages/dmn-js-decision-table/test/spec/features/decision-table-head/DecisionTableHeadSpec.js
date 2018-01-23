
// eslint-disable-next-line
import Inferno from 'inferno';

import { bootstrapViewer, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import CoreModule from 'lib/core';
import DecisionTableHeadModule from 'lib/features/decision-table-head';

describe('decision table head', function() {

  beforeEach(bootstrapViewer(simpleXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  it('should render head', function() {

    // then
    expect(domQuery('thead', testContainer)).to.exist;
  });


  it('should render input label', function() {

    // then
    expect(domQuery('.input-label', testContainer)).to.exist;
  });


  it('should render output label', function() {

    // then
    expect(domQuery('.output-label', testContainer)).to.exist;
  });


  it('should allow rendering before labels', inject(
    function(components, eventBus, sheet) {

      // given
      components.onGetComponent('cell', ({ cellType }) => {
        if (cellType === 'before-label-cells') {
          return () => <td className="foo">FOO</td>;
        }
      });

      const root = sheet.getRoot();

      // when
      eventBus.fire('elements.changed', { elements: [ root ] });

      // then
      expect(domQuery('.foo', testContainer)).to.exist;
    }
  ));


  it('should allow rendering after labels', inject(function(components, eventBus, sheet) {

    // given
    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'after-label-cells') {
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