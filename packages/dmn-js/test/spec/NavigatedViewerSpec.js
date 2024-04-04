import NavigatedViewer from 'src/NavigatedViewer';

import { expectToBeAccessible } from 'test/helper';


const diagram = require('./diagram.dmn');
const noDi = require('./no-di.dmn');

const dmn_11 = require('./dmn-11.dmn');

const singleStart = window.__env__ && window.__env__.SINGLE_START === 'navigated-viewer';


describe('NavigatedViewer', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');
    container.className = 'test-container';

    document.body.appendChild(container);
  });

  singleStart || afterEach(function() {
    document.body.removeChild(container);
  });


  it('should allow to configure container size', function() {

    // when
    const editor = new NavigatedViewer({
      width: '300px',
      height: 200,
      position: 'absolute'
    });

    // then
    expect(editor._container.style).to.include({
      width: '300px',
      height: '200px',
      position: 'absolute'
    });
  });


  it('should open DMN table', async function() {

    const editor = new NavigatedViewer({ container: container });

    await editor.importXML(diagram, { open: false });

    const views = editor.getViews();
    const decisionView = views.filter(v => v.type === 'decisionTable')[0];

    // can open decisions
    expect(decisionView.element.$instanceOf('dmn:Decision')).to.be.true;

    const { warnings } = await editor.open(decisionView);

    expect(warnings).to.have.lengthOf(0);
  });


  it('should open DMN literal expression', async function() {

    const editor = new NavigatedViewer({ container: container });

    await editor.importXML(diagram, { open: false });

    const views = editor.getViews();
    const decisionView = views.filter(v => v.type === 'literalExpression')[0];

    // can open decisions
    expect(decisionView.element.$instanceOf('dmn:Decision')).to.be.true;

    const { warnings } = await editor.open(decisionView);

    expect(warnings).to.have.lengthOf(0);
  });


  (singleStart ? it.only : it)('should open DRD', async function() {

    const editor = new NavigatedViewer({ container: container });

    await editor.importXML(diagram, { open: false });

    const views = editor.getViews();
    const drdView = views.filter(v => v.type === 'drd')[0];

    // can open decisions
    expect(drdView.element.$instanceOf('dmn:Definitions')).to.be.true;

    const { warnings } = await editor.open(drdView);

    expect(warnings).to.have.lengthOf(0);
  });


  it('should open Table (if no DI)', async function() {

    const editor = new NavigatedViewer({ container: container });

    await editor.importXML(noDi);

    const activeView = editor.getActiveView();

    expect(activeView.type).to.eql('decisionTable');
    expect(activeView.element.$instanceOf('dmn:Decision')).to.be.true;
  });


  describe('DMN compatibility', function() {

    it('should indicate DMN 1.1 incompatibility', function() {

      const editor = new NavigatedViewer({ container: container });

      return editor.importXML(dmn_11)
        .then(() => {
          throw new Error('should not have resolved');
        })
        .catch(err => {
          expect(err.message).to.match(
            /unsupported DMN 1\.1 file detected; only DMN 1\.3 files can be opened/
          );
        });
    });

  });


  describe('accessibility', function() {

    for (const viewType of [
      'drd',
      'literalExpression',
      'decisionTable',
      'boxedExpression'
    ]) {
      it(`should report no issues (${viewType})`, async function() {

        // given
        const editor = new NavigatedViewer({ container: container });
        await editor.importXML(diagram, { open: false });

        const views = editor.getViews();
        const decisionView = views.filter(v => v.type === viewType)[0];

        // when
        await editor.open(decisionView);

        // then
        await expectToBeAccessible(container);
      });
    }
  });
});
