import * as sinon from 'sinon';
import { expect } from 'chai';
import BoxedExpressionViewer from '../../../helper/Viewer';
import MockViewer from './MockViewer';

import TestContainer from 'mocha-test-container-support';

import { query as domQuery } from 'min-dom';

import { triggerClick } from 'dmn-js-shared/test/util/EventUtil';

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
      return viewer.open(view).then(() => viewer);
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


  it('should open DRD', async function() {

    // given
    const viewer = await createViewer(MockViewer, simpleXML);

    const drdView = viewer.getViews().find(view => view.type === 'drd');
    const open = sinon.spy(viewer, 'open');

    // when
    triggerClick(domQuery('.view-drd-button', testContainer));

    // then
    expect(open.calledOnceWith(drdView)).to.be.true;
  });

});
