import { bootstrapViewer, getDmnJS, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';
import missingTypeRefXML from './missing-type-ref.dmn';

import CoreModule from 'src/core';
import DecisionTableHeadModule from 'src/features/decision-table-head';


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


  it('should render header input cells with a [data-col-id] attribute', function() {

    // then
    expect(domQuery('[data-col-id]', testContainer)).to.exist;
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


  it('should render with missing typeRef', function() {

    // given
    const dmnjs = getDmnJS();

    // when
    return dmnjs.importXML(missingTypeRefXML).then(function({ warnings }) {
      expect(warnings).to.be.empty;
    });
  });
});