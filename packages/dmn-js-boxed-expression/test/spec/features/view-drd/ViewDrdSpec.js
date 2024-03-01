import BoxedExpressionViewer from '../../../helper/Viewer';
import MockViewer from './MockViewer';

import TestContainer from 'mocha-test-container-support';

import { query as domQuery } from 'min-dom';

import simpleXML from '../../literal-expression.dmn';


describe('view drd', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function createViewer(Viewer, xml) {
    const viewer = new Viewer({
      container: testContainer
    });

    return viewer.importXML(xml, { open: false }).then((importXMLResult) => {

      const view = viewer._views.filter(v => v.type === 'literalExpression')[0];

      expect(view).to.exist;

      // open view
      return viewer.open(view);
    });
  }


  it('should not show view drd button', async function() {
    await createViewer(BoxedExpressionViewer, simpleXML);

    // then
    expect(domQuery('.view-drd-button', testContainer)).to.not.exist;
  });


  it('should show view drd button', async function() {
    await createViewer(MockViewer, simpleXML);

    // then
    expect(domQuery('.view-drd-button', testContainer)).to.exist;
  });

});
