import DmnDecisionTableViewer from '../../../helper/DecisionTableViewer';
import MockViewer from './MockViewer';

import TestContainer from 'mocha-test-container-support';

import { query as domQuery } from 'min-dom';

import simpleXML from '../../simple.dmn';


describe('view drd', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function createViewer(Viewer, xml, done) {
    const viewer = new Viewer({
      container: testContainer
    });

    viewer.importXML(xml, { open: false }, (err, warnings) => {

      const view = viewer._views.filter(v => v.type === 'decisionTable')[0];

      expect(view).to.exist;

      if (err) {
        done(err);
      }

      // open decision table
      viewer.open(view)
        .then(
          result => {
            done(err || warnings[0] || result.warnings[0]);
          })
        .catch(
          error => {
            done(error);
          }
        );
    });
  }


  it('should not show view drd button', function(done) {
    createViewer(DmnDecisionTableViewer, simpleXML, function(err) {

      if (err) {
        return done(err);
      }

      // then
      expect(domQuery('.view-drd-button', testContainer)).to.not.exist;

      return done();
    });
  });


  it('should show view drd button', function(done) {
    createViewer(MockViewer, simpleXML, function(err) {

      if (err) {
        return done(err);
      }

      // then
      expect(domQuery('.view-drd-button', testContainer)).to.exist;

      return done();
    });
  });

});
