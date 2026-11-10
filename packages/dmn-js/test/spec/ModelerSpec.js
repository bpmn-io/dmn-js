import { expect } from 'chai';
import Modeler from 'src/Modeler';

import {
  triggerClick,
  triggerInputEvent,
  triggerKeyEvent,
  triggerMouseEvent,
  triggerInputSelectChange
} from 'dmn-js-shared/test/util/EventUtil';

import { expectToBeAccessible, insertCSS } from 'test/helper';

insertCSS('dmn-js-drd.css', require('dmn-js-drd/assets/css/dmn-js-drd.css'));

insertCSS('dmn-js-decision-table.css',
  require('dmn-js-decision-table/assets/css/dmn-js-decision-table.css')
);

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


  describe('custom data types', function() {

    beforeEach(async function() {
      await editor.importXML(diagram, { open: false });
    });


    async function openView(type) {
      const view = editor.getViews().find(view => view.type === type);

      await editor.open(view);

      return view;
    }

    async function saveAndReopen(view) {
      const { xml } = await editor.saveXML();

      await editor.importXML(xml, { open: false });

      const reopened = editor.getViews().find(
        candidate => candidate.element.id === view.element.id
      );

      await editor.open(reopened);

      return reopened.element;
    }

    function selectCustomType(select) {
      triggerInputSelectChange(select, 'Guest', container);
    }

    function openClauseTypeSelect(kind) {
      triggerMouseEvent(container.querySelector(`.${ kind }-label`), 'dblclick');

      return container.querySelector('.type-ref-edit-select');
    }

    it('should save only confirmed type searches', async function() {

      // given
      const view = await openView('decisionTable');
      const select = openClauseTypeSelect('input');
      const input = select.querySelector('input');
      const original = (await editor.saveXML()).xml;

      // when
      triggerInputEvent(input, 'Gue');

      // then
      expect((await editor.saveXML()).xml).to.equal(original);
      expect(container.querySelectorAll('.dms-select-options .option')).to.have.length(1);

      // when
      triggerKeyEvent(input, 'keydown', 27);

      // then
      expect((await editor.saveXML()).xml).to.equal(original);

      // when
      triggerInputEvent(input, 'Gue');
      triggerKeyEvent(input, 'keydown', 40);
      triggerKeyEvent(input, 'keydown', 13);
      const reopened = await saveAndReopen(view);

      // then
      expect(reopened.decisionLogic.input[0].inputExpression.typeRef).to.equal('Guest');
    });


    function addClauseAndOpenTypeSelect(view, kind) {
      const viewer = editor.getActiveViewer();
      const clauses = view.element.decisionLogic[kind];
      const col = viewer.get('elementRegistry').get(clauses[clauses.length - 1].id);

      viewer.get('editorActions').trigger(
        kind === 'input' ? 'addInputRight' : 'addOutputRight',
        { [ kind ]: col }
      );

      const cells = container.querySelectorAll(`th.${ kind }-cell`);

      triggerMouseEvent(cells[cells.length - 1], 'dblclick');

      return container.querySelector('.type-ref-edit-select');
    }

    function openFormalParametersSelect(add = false) {
      triggerClick(container.querySelector('[aria-label="Edit formal parameters"]'));

      if (add) {
        triggerClick(container.querySelector('.add-parameter'));
      }

      const selects = container.querySelectorAll(
        '.function-definition-parameter .dms-input-select'
      );

      return selects[add ? selects.length - 1 : 0];
    }

    const last = array => array[array.length - 1];

    const getClauseTypeRef = (kind, clause) => {
      return kind === 'input' ? clause.inputExpression.typeRef : clause.typeRef;
    };


    [
      {
        name: 'decision table input',
        type: 'decisionTable',
        openSelect: () => openClauseTypeSelect('input'),
        getTypeRef: decision => getClauseTypeRef('input', decision.decisionLogic.input[0])
      },
      {
        name: 'decision table output',
        type: 'decisionTable',
        openSelect: () => openClauseTypeSelect('output'),
        getTypeRef: decision => getClauseTypeRef('output', decision.decisionLogic.output[0])
      },
      {
        name: 'newly added decision table input',
        type: 'decisionTable',
        openSelect: view => addClauseAndOpenTypeSelect(view, 'input'),
        getTypeRef: decision => getClauseTypeRef('input', last(decision.decisionLogic.input))
      },
      {
        name: 'newly added decision table output',
        type: 'decisionTable',
        openSelect: view => addClauseAndOpenTypeSelect(view, 'output'),
        getTypeRef: decision => getClauseTypeRef('output', last(decision.decisionLogic.output))
      },
      {
        name: 'literal expression variable',
        type: 'literalExpression',
        openSelect: () => container.querySelector('.variable-type-select'),
        getTypeRef: decision => decision.variable.typeRef
      },
      {
        name: 'boxed expression result',
        type: 'boxedExpression',
        openSelect: () => container.querySelector('.element-variable-type .dms-input-select'),
        getTypeRef: decision => decision.encapsulatedLogic.body.typeRef
      },
      {
        name: 'formal parameter',
        type: 'boxedExpression',
        openSelect: () => openFormalParametersSelect(),
        getTypeRef: bkm => bkm.encapsulatedLogic.formalParameter[0].typeRef
      },
      {
        name: 'newly added formal parameter',
        type: 'boxedExpression',
        openSelect: () => openFormalParametersSelect(true),
        getTypeRef: bkm => last(bkm.encapsulatedLogic.formalParameter).typeRef
      }
    ].forEach(({ name, type, openSelect, getTypeRef }) => {

      describe(name, function() {

        let view, select;

        beforeEach(async function() {
          view = await openView(type);

          select = openSelect(view);
        });


        it('should select custom type', function() {

          // when
          selectCustomType(select);

          // then
          expect(getTypeRef(view.element)).to.equal('Guest');
        });


        it('should persist custom type', async function() {

          // given
          selectCustomType(select);

          // when
          const reopened = await saveAndReopen(view);

          // then
          expect(getTypeRef(reopened)).to.equal('Guest');
        });
      });
    });


    describe('DRD input data', function() {

      let view, element, select;

      beforeEach(async function() {
        view = await openView('drd');

        const viewer = editor.getActiveViewer();

        element = viewer.get('elementRegistry').get('dayType_id');

        viewer.get('selection').select(element);

        select = container.querySelector('.dms-type-ref-select input');
      });

      function selectOption(value) {
        select.value = value;
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: 13, which: 13 }));
      }


      it('should offer custom types', function() {

        // when
        select.click();
        const values = Array.from(container.querySelectorAll('[role=option]')).map(option => option.dataset.value);

        // then
        expect(values).to.include.members([ 'Guest', 'Season' ]);
      });


      it('should select custom type', function() {

        // when
        selectOption('Guest');

        // then
        expect(element.businessObject.variable.typeRef).to.equal('Guest');
      });


      it('should persist custom type', async function() {

        // given
        selectOption('Guest');

        // when
        const reopened = await saveAndReopen(view);

        // then
        const inputData = reopened.drgElement.find(element => element.id === 'dayType_id');

        expect(inputData.variable.typeRef).to.equal('Guest');
      });
    });
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


  describe('config', function() {

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
      const decisionTableView = editor.getViews().find(v => v.type === 'decisionTable');
      editor.open(decisionTableView);

      // when
      const dataTypes = editor.getActiveViewer().get('dataTypes');
      const dataTypesList = dataTypes.getAll();

      // then
      expect(dataTypesList).to.eql([
        { name: 'double', label: 'double' },
        { name: 'long', label: 'long' },
        { name: 'Guest', label: 'Guest', group: { id: 'custom', name: 'Custom' } },
        { name: 'Season', label: 'Season', group: { id: 'custom', name: 'Custom' } }
      ]);
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
        const editor = new Modeler({ container: container });
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
