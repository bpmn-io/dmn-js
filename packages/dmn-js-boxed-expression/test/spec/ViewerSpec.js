import * as sinon from 'sinon';
import { expect } from 'chai';


import TestContainer from 'mocha-test-container-support';

import axe from 'axe-core';

import {
  bootstrapViewer,
  inject,
  getBoxedExpressionViewer
} from 'test/TestHelper';

import Viewer from '../helper/Viewer';

import { domify } from 'min-dom';

import { insertCSS } from '../helper';

import simpleXML from './literal-expression.dmn';
import emptyXML from './empty-literal-expression.dmn';
import bkmXML from './bkm-literal-expression.dmn';


const singleStart = window.__env__ && window.__env__.SINGLE_START === 'viewer';

if (singleStart) {
  insertCSS('dmn-js-boxed-expression-single-start.css',
    'html, body, .test-container { margin: 0; height: 100%; }'
  );
}


describe('Viewer', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function createViewer(xml) {
    const viewer = new Viewer({
      container: testContainer
    });

    return viewer.importXML(xml);
  }


  // TODO(nikku): test re-import and #clear() interaction
  it.skip('should re-open, clearing the previous diagram');


  it('should import decision', function() {
    return createViewer(simpleXML);
  });


  it('should import decision with empty literal expression', function() {
    return createViewer(emptyXML);
  });


  it('should have <bio-theme-parent> at the root', async function() {

    // when
    await createViewer(simpleXML);

    // then
    // the --bio-* tokens are declared on this class; without it every
    // component variable resolves to nothing
    expect(testContainer.querySelector('.dmn-boxed-expression-container.bio-theme-parent')).to.exist;
  });


  (singleStart ? it.only : it)('should import business knowledge model', function() {
    return createViewer(bkmXML);
  });


  describe('#getRootElement', function() {

    beforeEach(bootstrapViewer(simpleXML, { container: testContainer }));

    it('should provide viewed decision', inject(function(viewer) {

      // when
      const decision = viewer.getRootElement();

      // then
      expect(decision).to.exist;
      expect(decision.id).to.eql('season');
    }));

  });


  describe('#attachTo', function() {

    let boxedExpressionViewer;

    beforeEach(bootstrapViewer(simpleXML, { container: testContainer }));

    beforeEach(function() {
      boxedExpressionViewer = getBoxedExpressionViewer();
    });


    it('should attach', function() {

      // given
      const container = domify('<div></div>');

      // when
      boxedExpressionViewer.attachTo(container);

      // then
      expect(boxedExpressionViewer._container.parentNode).to.equal(container);
    });


    it('should fire on attach', function() {

      // given
      const container = domify('<div></div>');

      const spy = sinon.spy();

      boxedExpressionViewer.on('attach', spy);

      // when
      boxedExpressionViewer.attachTo(container);

      // then
      expect(spy).to.have.been.called;
    });

  });


  describe('#detach', function() {

    let boxedExpressionViewer;

    beforeEach(bootstrapViewer(simpleXML, { container: testContainer }));

    beforeEach(function() {
      boxedExpressionViewer = getBoxedExpressionViewer();
    });


    it('should detach', function() {

      // when
      boxedExpressionViewer.detach();

      // then
      expect(boxedExpressionViewer._container.parentNode).to.not.exist;
    });


    it('should fire on attach', function() {

      // given
      const spy = sinon.spy();

      boxedExpressionViewer.on('detach', spy);

      // when
      boxedExpressionViewer.detach();

      // then
      expect(spy).to.have.been.called;
    });

  });


  describe('#destroy', function() {

    let boxedExpressionViewer;

    beforeEach(bootstrapViewer(simpleXML, { container: testContainer }));

    beforeEach(function() {
      boxedExpressionViewer = getBoxedExpressionViewer();
    });

    it('should destroy', function() {

      // when
      boxedExpressionViewer.destroy();

      // then
      expect(boxedExpressionViewer._container.parentNode).to.not.exist;
    });

  });


  describe('#on', function() {

    let boxedExpressionViewer;

    beforeEach(bootstrapViewer(simpleXML, { container: testContainer }));

    beforeEach(function() {
      boxedExpressionViewer = getBoxedExpressionViewer();
    });

    it('should add listener', function() {

      // when
      boxedExpressionViewer.on('foo', () => {
        return 'bar';
      });

      // then
      const result = boxedExpressionViewer.get('eventBus').fire('foo');

      expect(result).to.eql('bar');
    });

  });


  describe('#off', function() {

    let boxedExpressionViewer;

    beforeEach(bootstrapViewer(simpleXML, { container: testContainer }));

    beforeEach(function() {
      boxedExpressionViewer = getBoxedExpressionViewer();
    });

    it('should remove listener', function() {

      // given
      const listener = () => {
        return 'bar';
      };

      boxedExpressionViewer.on('foo', listener);

      // when
      boxedExpressionViewer.off('foo', listener);

      // then
      const result = boxedExpressionViewer.get('eventBus').fire('foo');

      expect(result).to.not.exist;
    });

  });


  describe('accessibility', function() {

    beforeEach(bootstrapViewer(simpleXML, { container: testContainer }));

    it('should report no issues', async function() {

      // when
      const results = await axe.run(testContainer);

      // then
      expect(results.passes).to.be.not.empty;
      expect(results.violations).to.be.empty;
    });
  });
});
