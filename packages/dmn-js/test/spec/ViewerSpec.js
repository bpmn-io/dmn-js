import { expect } from 'chai';
import Viewer from 'src/Viewer';

import DefaultExport from '../../src';

import { query as domQuery } from 'min-dom';

import { expectToBeAccessible, findView } from 'test/helper';


const diagram = require('./diagram.dmn');
const noDi = require('./no-di.dmn');
const bkmDecisionTable = require('./bkm-decision-table.dmn');

const dmn_11 = require('./dmn-11.dmn');
const drdOnly = require('./drd-only.dmn');

const singleStart = window.__env__ && window.__env__.SINGLE_START === 'viewer';


describe('Viewer', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');
    container.className = 'test-container';

    document.body.appendChild(container);
  });

  if (!singleStart) {
    afterEach(function() {
      document.body.removeChild(container);
    });
  }


  it('should expose Viewer as library default', function() {
    expect(DefaultExport).to.equal(Viewer);
  });


  it('should allow to configure container size', function() {

    // when
    const editor = new Viewer({
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

    const editor = new Viewer({ container: container });

    await editor.importXML(diagram, { open: false });


    const views = editor.getViews();
    const decisionView = findView(views, 'dish-decision');

    // can open decisions
    expect(decisionView.element.$instanceOf('dmn:Decision')).to.be.true;

    const { warnings } = await editor.open(decisionView);

    expect(warnings).to.have.lengthOf(0);
  });


  it('should not provide <decisionTable> view', async function() {

    // given
    const editor = new Viewer({ container: container });

    await editor.importXML(diagram, { open: false });

    // when
    const viewTypes = editor.getViews().map(view => view.type);

    // then
    expect(viewTypes).not.to.include('decisionTable');
  });


  it('should not provide <literalExpression> view', async function() {

    // given
    const editor = new Viewer({ container: container });

    await editor.importXML(diagram, { open: false });

    // when
    const viewTypes = editor.getViews().map(view => view.type);

    // then
    expect(viewTypes).not.to.include('literalExpression');
  });


  it('should open business knowledge model with decision table', async function() {

    // given
    const editor = new Viewer({ container: container });

    await editor.importXML(bkmDecisionTable, { open: false });

    const bkmView = findView(editor.getViews(), 'BKM_1');

    // when
    const { warnings } = await editor.open(bkmView);

    // then
    expect(bkmView.type).to.eql('boxedExpression');
    expect(warnings).to.have.lengthOf(0);
  });


  it('should open DMN literal expression', async function() {

    const editor = new Viewer({ container: container });

    await editor.importXML(diagram, { open: false });

    const views = editor.getViews();
    const decisionView = findView(views, 'Decision_1koag35');

    // can open decisions
    expect(decisionView.element.$instanceOf('dmn:Decision')).to.be.true;
    expect(decisionView.type).to.eql('boxedExpression');

    const { warnings } = await editor.open(decisionView);

    expect(warnings).to.have.lengthOf(0);
  });


  it('should display literal expression', async function() {

    // given
    const editor = new Viewer({ container: container });

    await editor.importXML(diagram, { open: false });

    // when
    await editor.open(findView(editor.getViews(), 'Decision_1koag35'));

    // then
    expect(
      domQuery('.dmn-boxed-expression-container .dmn-boxed-expression-body .textarea', container)
    ).to.exist;
  });


  (singleStart ? it.only : it)('should open DRD', async function() {

    const editor = new Viewer({ container: container });

    await editor.importXML(diagram, { open: false });

    const views = editor.getViews();
    const drdView = views.filter(v => v.type === 'drd')[0];

    // can open decisions
    expect(drdView.element.$instanceOf('dmn:Definitions')).to.be.true;

    const { warnings } = await editor.open(drdView);

    expect(warnings).to.have.lengthOf(0);
  });


  it('should open Table (if no DI)', async function() {

    const editor = new Viewer({ container: container });

    await editor.importXML(noDi);

    const activeView = editor.getActiveView();

    expect(activeView.type).to.eql('boxedExpression');
    expect(activeView.element.$instanceOf('dmn:Decision')).to.be.true;
  });


  it('should keep view on re-import', async function() {

    // given
    const editor = new Viewer({ container: container });
    await editor.importXML(diagram);

    const views = editor.getViews();
    const tableView = findView(views, 'dish-decision');

    const { warnings } = await editor.open(tableView);

    // when
    await editor.importXML(diagram);

    // then
    const activeView = editor.getActiveView();

    const element = activeView.element;

    expect(warnings[0]).to.be.undefined;

    expect(activeView.type).to.eql('boxedExpression');
    expect(element.$instanceOf('dmn:Decision')).to.be.true;
    expect(element.id).to.eql(tableView.element.id);
  });


  it('should clear diagram during re-import', async function() {

    // given
    const editor = new Viewer({ container: container });
    await editor.importXML(diagram, { open: false });

    const views = editor.getViews();
    const decisionView = findView(views, 'dish-decision');

    await editor.open(decisionView);

    // when
    await editor.importXML(drdOnly);

    // then
    const decisionTableContainer = domQuery('.dmn-decision-table-container', container);

    expect(decisionTableContainer).not.to.exist;
    expect(domQuery('.dmn-boxed-expression-container', container)).not.to.exist;
    expect(domQuery('.dmn-drd-container', container)).to.exist;
  });


  describe('DMN compatibility', function() {

    it('should indicate DMN 1.1 incompatibility', function() {

      const editor = new Viewer({ container: container });

      return editor.importXML(dmn_11).then(() => {
        throw new Error('should not have resolved');
      }).catch(err => {
        expect(err.message).to.match(
          /unsupported DMN 1\.1 file detected; only DMN 1\.3 files can be opened/
        );
      });
    });

  });


  describe('accessibility', function() {

    for (const { name, getView } of [
      {
        name: 'drd',
        getView: views => views.find(v => v.type === 'drd')
      },
      {
        name: 'literal expression',
        getView: views => findView(views, 'Decision_1koag35')
      },
      {
        name: 'decision table',
        getView: views => findView(views, 'dish-decision')
      },
      {
        name: 'business knowledge model',
        getView: views => findView(views, 'elMenu')
      }
    ]) {
      it(`should report no issues (${name})`, async function() {

        // given
        const editor = new Viewer({ container: container });
        await editor.importXML(diagram, { open: false });

        const views = editor.getViews();
        const decisionView = getView(views);

        // when
        await editor.open(decisionView);

        // then
        await expectToBeAccessible(container);
      });
    }
  });
});
