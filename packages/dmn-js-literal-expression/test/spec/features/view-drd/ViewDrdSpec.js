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

    viewer.importXML(xml, (err, warnings) => {

      // open decision table
      viewer.open(viewer._views.filter(v => v.type === 'literalExpression')[0]);

      done(err, warnings, viewer);
    });
  }

  it('should not show view drd button', function() {
    createViewer(DmnLiteralExpressionViewer, simpleXML, function() {

      // then
      expect(domQuery('.view-drd-button', testContainer)).to.not.exist;
    });
  });


  it('should show view drd button', function() {
    createViewer(MockViewer, simpleXML, function() {

      // then
      expect(domQuery('.view-drd-button', testContainer)).to.exist;
    });
  });

});