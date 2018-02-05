import TestContainer from 'mocha-test-container-support';

/* global sinon, bootstrapViewer, getLiteralExpression */

import DefaultExport from '../../';
import DecisionTableView from 'lib/Viewer';

import DmnLiteralExpressionViewer from '../helper/LiteralExpressionViewer';

import { domify } from 'min-dom';

import simpleXML from './literal-expression.dmn';

require('../TestHelper');

describe('Viewer', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function createViewer(xml, done) {
    const dmnLiteralExpressionViewer = new DmnLiteralExpressionViewer({
      container: testContainer
    });

    dmnLiteralExpressionViewer.importXML(xml, (err, warnings) => {
      done(err, warnings, dmnLiteralExpressionViewer);
    });
  }


  it('should expose Viewer as library default', function() {
    expect(DefaultExport).to.equal(DecisionTableView);
  });


  // TODO(nikku): test re-import and #clear() interaction
  it.skip('should re-open, clearing the previous diagram');


  it('should import literal expression', function(done) {
    createViewer(simpleXML, done);
  });


  describe('#attachTo', function() {

    let literalExpressionViewer;

    beforeEach(bootstrapViewer(simpleXML, { container: testContainer }));

    beforeEach(function() {
      literalExpressionViewer = getLiteralExpression();
    });


    it('should attach', function() {

      // given
      const container = domify('<div></div>');

      // when
      literalExpressionViewer.attachTo(container);

      // then
      expect(literalExpressionViewer._container.parentNode).to.equal(container);
    });


    it('should fire on attach', function() {

      // given
      const container = domify('<div></div>');

      const spy = sinon.spy();

      literalExpressionViewer.on('attach', spy);

      // when
      literalExpressionViewer.attachTo(container);

      // then
      expect(spy).to.have.been.called;
    });

  });


  describe('#detach', function() {

    let literalExpressionViewer;

    beforeEach(bootstrapViewer(simpleXML, { container: testContainer }));

    beforeEach(function() {
      literalExpressionViewer = getLiteralExpression();
    });


    it('should detach', function() {

      // when
      literalExpressionViewer.detach();

      // then
      expect(literalExpressionViewer._container.parentNode).to.not.exist;
    });


    it('should fire on attach', function() {

      // given
      const spy = sinon.spy();

      literalExpressionViewer.on('detach', spy);

      // when
      literalExpressionViewer.detach();

      // then
      expect(spy).to.have.been.called;
    });

  });


  describe('#destroy', function() {

    let literalExpressionViewer;

    beforeEach(bootstrapViewer(simpleXML, { container: testContainer }));

    beforeEach(function() {
      literalExpressionViewer = getLiteralExpression();
    });

    it('should destroy', function() {

      // when
      literalExpressionViewer.destroy();

      // then
      expect(literalExpressionViewer._container.parentNode).to.not.exist;
    });

  });


  describe('#on', function() {

    let literalExpressionViewer;

    beforeEach(bootstrapViewer(simpleXML, { container: testContainer }));

    beforeEach(function() {
      literalExpressionViewer = getLiteralExpression();
    });

    it('should add listener', function() {

      // when
      literalExpressionViewer.on('foo', () => {
        return 'bar';
      });

      // then
      const result = literalExpressionViewer.get('eventBus').fire('foo');

      expect(result).to.eql('bar');
    });

  });


  describe('#off', function() {

    let literalExpressionViewer;

    beforeEach(bootstrapViewer(simpleXML, { container: testContainer }));

    beforeEach(function() {
      literalExpressionViewer = getLiteralExpression();
    });

    it('should remove listener', function() {

      // given
      const listener = () => {
        return 'bar';
      };

      literalExpressionViewer.on('foo', listener);

      // when
      literalExpressionViewer.off('foo', listener);

      // then
      const result = literalExpressionViewer.get('eventBus').fire('foo');

      expect(result).to.not.exist;
    });

  });

});