import DmnLiteralExpressionViewer from '../../../helper/LiteralExpressionViewer';
import MockViewer from './MockViewer';

import TestContainer from 'mocha-test-container-support';

import { query as domQuery } from 'min-dom';

import simpleXML from '../../literal-expression.dmn';


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

      const view = viewer._views.filter(v => v.type === 'literalExpression')[0];

      expect(view).to.exist;

      // open decision table
      viewer.open(view, function(_err) {
        return done(err || _err, warnings, viewer);
      });
    });
  }


  it('should not show view drd button', function(done) {
    createViewer(DmnLiteralExpressionViewer, simpleXML, function(err) {

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