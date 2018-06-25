/* global sinon */

import {
  bootstrapViewer,
  getDecisionTable
} from 'test/TestHelper';

import TestContainer from 'mocha-test-container-support';

import DefaultExport from '../../src';
import DecisionTableView from 'src/Viewer';

import DmnDecisionTableViewer from '../helper/DecisionTableViewer';

import {
  domify
} from 'min-dom';

import simpleXML from './simple.dmn';


describe('DecisionTable', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  let dmnJS;

  afterEach(function() {
    if (dmnJS) {
      dmnJS.destroy();
      dmnJS = null;
    }
  });

  function createDecisionTable(xml, done) {
    dmnJS = new DmnDecisionTableViewer({
      container: testContainer
    });

    dmnJS.importXML(xml, (err, warnings) => {
      done(err, warnings, dmnJS);
    });
  }


  it('should expose Viewer as library default', function() {
    expect(DefaultExport).to.equal(DecisionTableView);
  });


  // TODO(nikku): test re-import and #clear() interaction
  it.skip('should re-open, clearing the previous diagram');


  it('should import simple decision', function(done) {
    createDecisionTable(simpleXML, done);
  });


  describe('#attachTo', function() {

    let decisionTableViewer;

    beforeEach(bootstrapViewer(simpleXML, {
      container: testContainer
    }));

    beforeEach(function() {
      decisionTableViewer = getDecisionTable();
    });


    it('should attach', function() {

      // given
      const container = domify('<div></div>');

      // when
      decisionTableViewer.attachTo(container);

      // then
      expect(decisionTableViewer._container.parentNode).to.equal(container);
    });


    it('should fire on attach', function() {

      // given
      const container = domify('<div></div>');

      const spy = sinon.spy();

      decisionTableViewer.on('attach', spy);

      // when
      decisionTableViewer.attachTo(container);

      // then
      expect(spy).to.have.been.called;
    });

  });


  describe('#detach', function() {

    let decisionTableViewer;

    beforeEach(bootstrapViewer(simpleXML, {
      container: testContainer
    }));

    beforeEach(function() {
      decisionTableViewer = getDecisionTable();
    });


    it('should detach', function() {

      // when
      decisionTableViewer.detach();

      // then
      expect(decisionTableViewer._container.parentNode).to.not.exist;
    });


    it('should fire on attach', function() {

      // given
      const spy = sinon.spy();

      decisionTableViewer.on('detach', spy);

      // when
      decisionTableViewer.detach();

      // then
      expect(spy).to.have.been.called;
    });

  });


  describe('#destroy', function() {

    let decisionTableViewer;

    beforeEach(bootstrapViewer(simpleXML, {
      container: testContainer
    }));

    beforeEach(function() {
      decisionTableViewer = getDecisionTable();
    });


    it('should destroy', function() {

      // when
      decisionTableViewer.destroy();

      // then
      expect(decisionTableViewer._container.parentNode).to.not.exist;
    });

  });


  describe('#on', function() {

    let decisionTableViewer;

    beforeEach(bootstrapViewer(simpleXML, { container: testContainer }));

    beforeEach(function() {
      decisionTableViewer = getDecisionTable();
    });

    it('should add listener', function() {

      // when
      decisionTableViewer.on('foo', () => {
        return 'bar';
      });

      // then
      const result = decisionTableViewer.get('eventBus').fire('foo');

      expect(result).to.eql('bar');
    });

  });


  describe('#off', function() {

    let decisionTableViewer;

    beforeEach(bootstrapViewer(simpleXML, {
      container: testContainer
    }));

    beforeEach(function() {
      decisionTableViewer = getDecisionTable();
    });

    it('should remove listener', function() {

      // given
      const listener = () => {
        return 'bar';
      };

      decisionTableViewer.on('foo', listener);

      // when
      decisionTableViewer.off('foo', listener);

      // then
      const result = decisionTableViewer.get('eventBus').fire('foo');

      expect(result).to.not.exist;
    });

  });

});