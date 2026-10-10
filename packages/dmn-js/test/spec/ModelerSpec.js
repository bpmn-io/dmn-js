import { expect } from 'chai';
import Modeler from 'src/Modeler';

import { query as domQuery } from 'min-dom';

import { expectToBeAccessible, findView, insertCSS } from 'test/helper';

insertCSS('dmn-js-drd.css', require('dmn-js-drd/assets/css/dmn-js-drd.css'));

insertCSS('dmn-js-literal-expression.css',
  require('dmn-js-literal-expression/assets/css/dmn-js-literal-expression.css')
);

insertCSS('dmn-js-boxed-expression.css',
  require('dmn-js-boxed-expression/assets/css/dmn-js-boxed-expression.css')
);

insertCSS('dmn-js-boxed-expression-controls.css',
  require('dmn-js-boxed-expression/assets/css/dmn-js-boxed-expression-controls.css')
);

insertCSS('diagram-js.css', require('diagram-js/assets/diagram-js.css'));

insertCSS('dmn-js-testing.css',
  '.test-container { height: 500px; }'
);

const singleStart = window.__env__ && window.__env__.SINGLE_START === 'modeler';

if (singleStart) {
  insertCSS('dmn-js-single-start.css',
    'html, body, .test-container { margin: 0; height: 100%; }'
  );
}


describe('Modeler', function() {

  const diagram = require('./diagram.dmn');
  const noDi = require('./no-di.dmn');
  const noDisplayableContents = require('./no-displayable-contents.dmn');
  const bkmDecisionTable = require('./bkm-decision-table.dmn');

  let container;
  let editor;

  beforeEach(function() {
    container = document.createElement('div');
    container.className = 'test-container';

    document.body.appendChild(container);

    editor = new Modeler({
      container: container,
    });

    if (singleStart) {
      editor.on('viewer.created', ({ viewer }) => viewer.on('elements.changed', function() {
        editor.saveXML({ format: true }).then(({ xml }) => console.log(xml)).catch(console.error);
      }));
    }
  });

  if (!singleStart) {
    afterEach(function() {
      if (editor) {
        editor.destroy();

        editor = null;
      }

      document.body.removeChild(container);
    });
  }


  it('should open DMN table', async function() {

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
    await editor.importXML(diagram, { open: false });

    // when
    const viewTypes = editor.getViews().map(view => view.type);

    // then
    expect(viewTypes).not.to.include('decisionTable');
  });


  it('should open business knowledge model with decision table', async function() {

    // given
    await editor.importXML(bkmDecisionTable, { open: false });

    const bkmView = findView(editor.getViews(), 'BKM_1');

    // when
    const { warnings } = await editor.open(bkmView);

    // then
    expect(bkmView.type).to.eql('boxedExpression');
    expect(warnings).to.have.lengthOf(0);
    expect(domQuery('.dmn-decision-table-container', container)).to.exist;
  });


  describe('replace business knowledge model with decision table', function() {

    beforeEach(async function() {
      await editor.importXML(diagram);

      const drdViewer = editor.getActiveViewer();

      drdViewer.get('drdReplace').replaceElement(
        drdViewer.get('elementRegistry').get('elMenu'),
        {
          type: 'dmn:BusinessKnowledgeModel',
          table: true,
          expression: false
        }
      );
    });


    it('should display decision table', async function() {

      // when
      await editor.open(findView(editor.getViews(), 'elMenu'));

      // then
      expect(
        domQuery('.dmn-boxed-expression-container .dmn-decision-table-container', container)
      ).to.exist;
    });


    it('should export decision table as body of encapsulated logic', async function() {

      // when
      const { xml } = await editor.saveXML();

      // then
      expect(xml).to.match(/<encapsulatedLogic[^>]*>\s*<decisionTable/);
    });

  });


  it('should open DMN literal expression', async function() {

    await editor.importXML(diagram, { open: false });

    const views = editor.getViews();
    const decisionView = views.filter(v => v.type === 'literalExpression')[0];

    // can open decisions
    expect(decisionView.element.$instanceOf('dmn:Decision')).to.be.true;

    const { warnings } = await editor.open(decisionView);

    expect(warnings).to.have.lengthOf(0);
  });


  (singleStart ? it.only : it)('should open DRD', async function() {

    await editor.importXML(diagram, { open: false });

    const views = editor.getViews();
    const drdView = views.filter(v => v.type === 'drd')[0];

    // can open decisions
    expect(drdView.element.$instanceOf('dmn:Definitions')).to.be.true;

    const { warnings } = await editor.open(drdView);

    expect(warnings).to.have.lengthOf(0);
  });


  describe('should open Table (if no DI)', function() {

    it('initial open', async function() {

      await editor.importXML(noDi);

      const activeView = editor.getActiveView();

      expect(activeView.type).to.eql('boxedExpression');
      expect(activeView.element.$instanceOf('dmn:Decision')).to.be.true;
    });


    it('on re-import', async function() {

      await editor.importXML(diagram);

      await editor.importXML(noDi);

      const activeView = editor.getActiveView();

      expect(activeView.type).to.eql('boxedExpression');
      expect(activeView.element.$instanceOf('dmn:Decision')).to.be.true;
    });

  });


  describe('should open DRD (if no DI / no displayable contents)', function() {

    it('initial open', async function() {

      await editor.importXML(noDisplayableContents);

      const activeView = editor.getActiveView();

      expect(activeView.type).to.eql('drd');
      expect(activeView.element.$instanceOf('dmn:Definitions')).to.be.true;
    });


    it('on re-import', async function() {

      await editor.importXML(diagram);

      await editor.importXML(noDisplayableContents);

      const activeView = editor.getActiveView();

      expect(activeView.type).to.eql('drd');
      expect(activeView.element.$instanceOf('dmn:Definitions')).to.be.true;
    });

  });


  it('should keep view on re-import', async function() {

    // given
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


  it('should update views on decision name change', async function() {

    // given
    await editor.importXML(diagram, { open: false });

    const decisionView = findView(editor.getViews(), 'dish-decision');

    await editor.open(decisionView);

    // when
    editor.getActiveViewer().get('modeling').updateProperties(
      decisionView.element, { name: 'Renamed' }
    );

    // then
    expect(findView(editor.getViews(), 'dish-decision').name).to.eql('Renamed');
  });


  describe('config', function() {

    it('should use options provided via <boxedExpression>', async function() {

      // given
      editor = new Modeler({
        container: container,
        boxedExpression: {
          keyboard: { bind: false }
        }
      });

      await editor.importXML(diagram, { open: false });

      // when
      await editor.open(findView(editor.getViews(), 'dish-decision'));

      // then
      expect(editor.getActiveViewer().get('keyboard').getBinding()).not.to.exist;
    });


    it('should ignore options provided via <decisionTable>', async function() {

      // given
      editor = new Modeler({
        container: container,
        decisionTable: {
          keyboard: { bind: false }
        }
      });

      await editor.importXML(diagram, { open: false });

      // when
      await editor.open(findView(editor.getViews(), 'dish-decision'));

      // then
      expect(editor.getActiveViewer().get('keyboard').getBinding()).to.exist;
    });


    it('should use data types provided via <common.dataTypes>', async function() {

      // given
      editor = new Modeler({
        container: container,
        common: {
          dataTypes: [
            'double',
            'long'
          ]
        }
      });
      await editor.importXML(diagram);
      const decisionTableView = findView(editor.getViews(), 'dish-decision');
      await editor.open(decisionTableView);

      // when
      const dataTypes = editor.getActiveViewer().get('dataTypes');
      const dataTypesList = dataTypes.getAll();

      // then
      expect(dataTypesList).to.eql([
        'double',
        'long'
      ]);
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
        getView: views => views.find(v => v.type === 'literalExpression')
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
        const editor = new Modeler({ container: container });
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
