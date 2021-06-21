import Modeler from 'src/Modeler';

import { insertCSS } from 'test/helper';

insertCSS('dmn-js-drd.css', require('dmn-js-drd/assets/css/dmn-js-drd.css'));

insertCSS('dmn-js-decision-table.css',
  require('dmn-js-decision-table/assets/css/dmn-js-decision-table.css')
);

insertCSS('diagram-js.css', require('diagram-js/assets/diagram-js.css'));

insertCSS('dmn-js-testing.css',
  '.test-container { height: 500px; }'
);

const singleStart = window.__env__ && window.__env__.SINGLE_START === 'modeler';


describe('Modeler', function() {

  const diagram = require('./diagram.dmn');
  const noDi = require('./no-di.dmn');
  const noDisplayableContents = require('./no-displayable-contents.dmn');

  let container;
  let editor;

  beforeEach(function() {
    container = document.createElement('div');
    container.className = 'test-container';

    document.body.appendChild(container);

    editor = new Modeler({
      container: container,
      common: {
        keyboard: {
          bindTo: document
        }
      }
    });
  });

  singleStart || afterEach(function() {
    if (editor) {
      editor.destroy();

      editor = null;
    }

    document.body.removeChild(container);
  });


  it('should open DMN table', async function() {

    await editor.importXML(diagram, { open: false });

    const views = editor.getViews();
    const decisionView = views.filter(v => v.type === 'decisionTable')[0];

    // can open decisions
    expect(decisionView.element.$instanceOf('dmn:Decision')).to.be.true;

    const { warnings } = await editor.open(decisionView);

    expect(warnings).to.have.lengthOf(0);
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

      expect(activeView.type).to.eql('decisionTable');
      expect(activeView.element.$instanceOf('dmn:Decision')).to.be.true;
    });


    it('on re-import', async function() {

      await editor.importXML(diagram);

      await editor.importXML(noDi);

      const activeView = editor.getActiveView();

      expect(activeView.type).to.eql('decisionTable');
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
    const tableView = views.filter(v => v.type === 'decisionTable')[0];

    const { warnings } = await editor.open(tableView);

    // when
    await editor.importXML(diagram);

    // then
    const activeView = editor.getActiveView();

    const element = activeView.element;

    expect(warnings[0]).to.be.undefined;

    expect(activeView.type).to.eql('decisionTable');
    expect(element.$instanceOf('dmn:Decision')).to.be.true;
    expect(element.id).to.eql(tableView.element.id);
  });

});
