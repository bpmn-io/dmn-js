import * as sinon from 'sinon';
import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import {
  bootstrapModeler,
  getBoxedExpressionViewer,
  getDmnJS,
  inject
} from 'test/helper';

import ContextHost from 'test/helper/ContextHost';

import { triggerClick } from 'dmn-js-shared/test/util/EventUtil';

import contextXML from '../../context-two-tables.dmn';


describe('features/decision-table - several tables', function() {

  let testContainer, discount, shipping;

  beforeEach(bootstrapModeler(contextXML, {
    additionalModules: [ ContextHost ],
    debounceInput: false
  }));

  beforeEach(inject(function(sheet) {
    [ discount, shipping ] = sheet.getRoots();
  }));

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function getTables() {
    return Array.from(domQueryAll('.dmn-decision-table-container', testContainer));
  }

  function getRuleCount(table) {
    return domQueryAll('tbody tr', table).length;
  }

  function getRuleCounts() {
    return getTables().map(getRuleCount);
  }


  describe('rendering', function() {

    it('should render all tables', function() {

      // then
      expect(getTables()).to.have.length(2);
    });


    it('should render rules of each table', function() {

      // then
      expect(getRuleCounts()).to.eql([ 2, 1 ]);
    });


    it('should render head of each table', function() {

      // then
      const [ first, second ] = getTables();

      expect(domQueryAll('thead th.input-cell', first)).to.have.length(1);
      expect(domQueryAll('thead th.input-cell', second)).to.have.length(2);
    });


    it('should render hit policy of each table', function() {

      // then
      const [ first, second ] = getTables();

      expect(domQuery('.hit-policy .dms-input', first).textContent).to.eql('Unique');
      expect(domQuery('.hit-policy .dms-input', second).textContent).to.eql('First');
    });

    it('should render only own entries', function() {

      // then
      const [ , second ] = getTables();

      expect(domQuery('[data-element-id="UnaryTests_discount_1"]', second))
        .not.to.exist;
    });

  });


  describe('hit policy', function() {

    it('should edit hit policy of table', function() {

      // given
      const [ , second ] = getTables();

      triggerClick(domQuery('.hit-policy-edit-policy-select', second));

      // when
      triggerClick(domQuery('.options .option:nth-child(4)', testContainer));

      // then
      expect(shipping.businessObject.hitPolicy).to.equal('ANY');
    });


    it('should NOT edit hit policy of other table', function() {

      // given
      const [ , second ] = getTables();

      triggerClick(domQuery('.hit-policy-edit-policy-select', second));

      // when
      triggerClick(domQuery('.options .option:nth-child(4)', testContainer));

      // then
      expect(discount.businessObject.hitPolicy).not.to.equal('ANY');
    });


    it('should update hit policy of table', function() {

      // given
      const [ , second ] = getTables();

      triggerClick(domQuery('.hit-policy-edit-policy-select', second));

      // when
      triggerClick(domQuery('.options .option:nth-child(4)', testContainer));

      // then
      expect(domQuery('.hit-policy .dms-input', getTables()[1]).textContent)
        .to.eql('Any');
    });

  });


  describe('rules', function() {

    it('should add rule to table on click', function() {

      // given
      const [ , second ] = getTables();

      // when
      triggerClick(domQuery('tfoot.add-rule', second));

      // then
      expect(shipping.rows).to.have.length(2);
    });


    it('should NOT add rule to other table on click', function() {

      // given
      const [ , second ] = getTables();

      // when
      triggerClick(domQuery('tfoot.add-rule', second));

      // then
      expect(discount.rows).to.have.length(2);
    });


    it('should render added rule in table', function() {

      // given
      const [ , second ] = getTables();

      // when
      triggerClick(domQuery('tfoot.add-rule', second));

      // then
      expect(getRuleCounts()).to.eql([ 2, 2 ]);
    });


    it('should add rule to table of selection', inject(
      function(editorActions, selection) {

        // given
        selection.select(shipping.rows[0].cells[0]);

        // when
        editorActions.trigger('addRule');

        // then
        expect(shipping.rows).to.have.length(2);
      }
    ));


    it('should add rule to given table', inject(function(editorActions) {

      // when
      editorActions.trigger('addRule', { root: shipping });

      // then
      expect(shipping.rows).to.have.length(2);
    }));


    it('should prefer given table over selection', inject(
      function(editorActions, selection) {

        // given
        selection.select(shipping.rows[0].cells[0]);

        // when
        editorActions.trigger('addRule', { root: discount });

        // then
        expect(discount.rows).to.have.length(3);
        expect(shipping.rows).to.have.length(1);
      }
    ));


    it('should add rule to primary table per default', inject(function(editorActions) {

      // when
      editorActions.trigger('addRule');

      // then
      expect(discount.rows).to.have.length(3);
    }));


    it('should add rule above rule', inject(function(editorActions) {

      // when
      editorActions.trigger('addRuleAbove', { rule: shipping.rows[0] });

      // then
      expect(shipping.rows).to.have.length(2);
      expect(discount.rows).to.have.length(2);
    }));


    it('should add rule below rule', inject(function(editorActions) {

      // given
      const rule = shipping.rows[0];

      // when
      editorActions.trigger('addRuleBelow', { rule });

      // then
      expect(shipping.rows[0]).to.equal(rule);
      expect(shipping.rows).to.have.length(2);
    }));


    it('should remove rule from table', inject(function(editorActions) {

      // when
      editorActions.trigger('removeRule', { rule: shipping.rows[0] });

      // then
      expect(shipping.rows).to.have.length(0);
      expect(discount.rows).to.have.length(2);
    }));


    it('should update business object of table', inject(function(editorActions) {

      // when
      editorActions.trigger('addRule', { root: shipping });

      // then
      expect(shipping.businessObject.rule).to.have.length(2);
      expect(discount.businessObject.rule).to.have.length(2);
    }));

  });


  describe('clauses', function() {

    it('should add input to given table', inject(function(editorActions) {

      // when
      editorActions.trigger('addInput', { root: shipping });

      // then
      expect(shipping.businessObject.input).to.have.length(3);
      expect(discount.businessObject.input).to.have.length(1);
    }));


    it('should add output to given table', inject(function(editorActions) {

      // when
      editorActions.trigger('addOutput', { root: shipping });

      // then
      expect(shipping.businessObject.output).to.have.length(2);
      expect(discount.businessObject.output).to.have.length(2);
    }));


    it('should add input to table of selection', inject(
      function(editorActions, selection) {

        // given
        selection.select(shipping.rows[0].cells[0]);

        // when
        editorActions.trigger('addInput');

        // then
        expect(shipping.businessObject.input).to.have.length(3);
      }
    ));


    it('should add input left of input', inject(function(editorActions) {

      // given
      const input = shipping.cols[1];

      // when
      editorActions.trigger('addInputLeft', { input });

      // then
      expect(shipping.cols[1]).not.to.equal(input);
      expect(shipping.cols[2]).to.equal(input);
    }));


    it('should add output right of output', inject(function(editorActions) {

      // given
      const output = shipping.cols[2];

      // when
      editorActions.trigger('addOutputRight', { output });

      // then
      expect(shipping.cols).to.have.length(4);
      expect(discount.cols).to.have.length(3);
    }));


    it('should remove input from table', inject(function(editorActions) {

      // given
      const input = shipping.cols[0];

      // when
      editorActions.trigger('removeInput', { input });

      // then
      expect(shipping.businessObject.input).to.have.length(1);
      expect(discount.businessObject.input).to.have.length(1);
    }));


    it('should add output via header of table', function() {

      // given
      const [ , second ] = getTables();

      // when
      triggerClick(domQuery('.add-output', second));

      // then
      expect(shipping.businessObject.output).to.have.length(2);
      expect(discount.businessObject.output).to.have.length(2);
    });


    it('should add input via header of table', function() {

      // given
      const [ , second ] = getTables();

      // when
      triggerClick(domQuery('.add-input', second));

      // then
      expect(shipping.businessObject.input).to.have.length(3);
      expect(discount.businessObject.input).to.have.length(1);
    });


    it('should add input to table without inputs via header', inject(
      function(editorActions) {

        // given
        editorActions.trigger('removeInput', { input: shipping.cols[0] });
        editorActions.trigger('removeInput', { input: shipping.cols[0] });

        const [ , second ] = getTables();

        // when
        triggerClick(domQuery('th.create-inputs', second));

        // then
        expect(shipping.businessObject.input).to.have.length(1);
        expect(discount.businessObject.input).to.have.length(1);
      }
    ));


    it('should render added input in table', function() {

      // given
      const [ , second ] = getTables();

      // when
      triggerClick(domQuery('.add-input', second));

      // then
      expect(domQueryAll('thead th.input-cell', getTables()[1])).to.have.length(3);
      expect(domQueryAll('thead th.input-cell', getTables()[0])).to.have.length(1);
    });

  });


  describe('undo', function() {

    it('should undo edits of both tables in reverse order', inject(
      function(commandStack, editorActions) {

        // given
        editorActions.trigger('addRule', { root: discount });
        editorActions.trigger('addRule', { root: shipping });

        // when
        commandStack.undo();

        // then
        expect(shipping.rows).to.have.length(1);
        expect(discount.rows).to.have.length(3);
      }
    ));


    it('should update table of undone edit', inject(
      function(commandStack, editorActions) {

        // given
        editorActions.trigger('addRule', { root: discount });
        editorActions.trigger('addRule', { root: shipping });

        // when
        commandStack.undo();

        // then
        expect(getRuleCounts()).to.eql([ 3, 1 ]);
      }
    ));


    it('should redo', inject(function(commandStack, editorActions) {

      // given
      editorActions.trigger('addRule', { root: shipping });

      commandStack.undo();

      // when
      commandStack.redo();

      // then
      expect(getRuleCounts()).to.eql([ 2, 2 ]);
    }));


    it('should undo removing input', inject(function(commandStack, editorActions) {

      // given
      const input = shipping.cols[0];

      editorActions.trigger('removeInput', { input });

      // when
      commandStack.undo();

      // then
      expect(shipping.cols[0]).to.equal(input);
      expect(shipping.businessObject.input[0]).to.equal(input.businessObject);
    }));

  });


  describe('selection', function() {

    it('should select cell below within table', inject(function(cellSelection) {

      // given
      const cell = discount.rows[0].cells[0];

      domQuery(`[data-element-id="${ cell.id }"]`, testContainer)
        .dispatchEvent(new Event('click', { bubbles: true }));

      // when
      const moved = cellSelection.selectCell('below');

      // then
      expect(moved).to.be.true;
      expect(cellSelection.getCellSelection()).to.equal(discount.rows[1].cells[0].id);
    }));


    it('should NOT select cell of other table', inject(function(cellSelection) {

      // given
      const cell = shipping.rows[0].cells[0];

      domQuery(`[data-element-id="${ cell.id }"]`, testContainer)
        .dispatchEvent(new Event('click', { bubbles: true }));

      // when
      const moved = cellSelection.selectCell('below');

      // then
      expect(moved).to.be.false;
      expect(cellSelection.getCellSelection()).to.equal(cell.id);
    }));

  });


  describe('modeling rules', function() {

    it('should allow removing output if table has several', inject(function(rules) {

      // then
      expect(rules.allowed('col.remove', { col: discount.cols[2] })).to.be.true;
    }));


    it('should NOT allow removing last output of table', inject(function(rules) {

      // then
      expect(rules.allowed('col.remove', { col: shipping.cols[2] })).to.be.false;
    }));


    it('should allow moving input within inputs of table', inject(function(rules) {

      // then
      expect(rules.allowed('col.move', { col: shipping.cols[0], index: 1 })).to.be.true;
    }));


    it('should NOT allow moving input behind inputs of table', inject(function(rules) {

      // then
      expect(rules.allowed('col.move', { col: discount.cols[0], index: 1 })).to.be.false;
    }));

  });


  describe('copy and paste', function() {

    it('should paste rule into table', inject(function(copyCutPaste) {

      // given
      const rule = shipping.rows[0];

      copyCutPaste.copy(rule);

      // when
      copyCutPaste.pasteAfter(rule);

      // then
      expect(shipping.rows).to.have.length(2);
      expect(discount.rows).to.have.length(2);
    }));


    it('should render pasted rule in table', inject(function(copyCutPaste) {

      // given
      const rule = shipping.rows[0];

      copyCutPaste.copy(rule);

      // when
      copyCutPaste.pasteAfter(rule);

      // then
      expect(getRuleCounts()).to.eql([ 2, 2 ]);
    }));


    it('should NOT paste rule into table with other cols', inject(
      function(copyCutPaste) {

        // given
        copyCutPaste.copy(shipping.rows[0]);

        // when
        const pasted = copyCutPaste.pasteAfter(discount.rows[0]);

        // then
        expect(pasted).to.be.false;
      }
    ));


    it('should paste col into table', inject(function(copyCutPaste) {

      // given
      const [ first, second ] = shipping.cols;

      copyCutPaste.copy(first);

      // when
      copyCutPaste.pasteAfter(second);

      // then
      expect(shipping.cols).to.have.length(4);
      expect(discount.cols).to.have.length(3);
    }));


    it('should cut col from table', inject(function(copyCutPaste) {

      // given
      const [ first ] = shipping.cols;

      // when
      copyCutPaste.cut(first);

      // then
      expect(shipping.cols).to.have.length(2);
      expect(discount.cols).to.have.length(3);
    }));


    it('should undo cut col', inject(function(commandStack, copyCutPaste) {

      // given
      const [ first ] = shipping.cols;

      copyCutPaste.cut(first);

      // when
      commandStack.undo();

      // then
      expect(shipping.cols[0]).to.equal(first);
      expect(getTables()[1].querySelectorAll('thead th.input-cell')).to.have.length(2);
    }));


    it('should cut rule from table', inject(function(copyCutPaste) {

      // when
      copyCutPaste.cut(discount.rows[0]);

      // then
      expect(discount.rows).to.have.length(1);
      expect(shipping.rows).to.have.length(1);
    }));


    it('should undo cut', inject(function(commandStack, copyCutPaste) {

      // given
      copyCutPaste.cut(discount.rows[0]);

      // when
      commandStack.undo();

      // then
      expect(getRuleCounts()).to.eql([ 2, 1 ]);
    }));

  });


  describe('drag and drop', function() {

    it('should move rule within table', inject(function(elementRegistry) {

      // given
      const [ first, second ] = discount.rows;

      // when
      dragAndDrop(`[data-row-id="${ first.id }"] .dmn-icon-drag`,
        `[data-row-id="${ second.id }"]`, 'bottom');

      // then
      expect(discount.rows).to.eql([ second, first ]);
    }));


    it('should move rule within secondary table', inject(function(editorActions) {

      // given
      editorActions.trigger('addRule', { root: shipping });

      const [ first, second ] = shipping.rows;

      // when
      dragAndDrop(`[data-row-id="${ first.id }"] .dmn-icon-drag`,
        `[data-row-id="${ second.id }"]`, 'bottom');

      // then
      expect(shipping.rows).to.eql([ second, first ]);
    }));


    it('should move col within secondary table', inject(function(editorActions) {

      // given
      editorActions.trigger('addInput', { root: shipping });

      const [ first, second, third ] = shipping.cols;

      // when
      dragAndDrop(`[data-col-id="${ first.id }"] .dmn-icon-drag`,
        `[data-col-id="${ second.id }"]`, 'right');

      // then
      expect(shipping.cols.slice(0, 3)).to.eql([ second, first, third ]);
    }));


    it('should NOT move rule to other table', inject(function(modeling) {

      // given
      const spy = sinon.spy(modeling, 'moveRow');

      // when
      dragAndDrop(`[data-row-id="${ discount.rows[0].id }"] .dmn-icon-drag`,
        `[data-row-id="${ shipping.rows[0].id }"]`, 'bottom');

      // then
      expect(spy).not.to.have.been.called;
    }));


    it('should move col within table', function() {

      // given
      const [ , first, second ] = discount.cols;

      // when
      dragAndDrop(`[data-col-id="${ first.id }"] .dmn-icon-drag`,
        `[data-col-id="${ second.id }"]`, 'right');

      // then
      expect(discount.cols.slice(1)).to.eql([ second, first ]);
    });


    it('should NOT move col to other table', inject(function(modeling) {

      // given
      const spy = sinon.spy(modeling, 'moveCol');

      // when
      dragAndDrop(`[data-col-id="${ discount.cols[1].id }"] .dmn-icon-drag`,
        `[data-col-id="${ shipping.cols[2].id }"]`, 'right');

      // then
      expect(spy).not.to.have.been.called;
    }));

  });


  describe('lifecycle', function() {

    it('should render tables again on reimport', async function() {

      // when
      await getDmnJS().importXML(contextXML);

      // then
      expect(getTables()).to.have.length(2);
    });


    it('should NOT keep roots on reimport', async function() {

      // when
      await getDmnJS().importXML(contextXML);

      // then
      expect(getBoxedExpressionViewer().get('sheet').getRoots()).to.have.length(2);
    });

  });


  // helpers //////////

  function dragAndDrop(handleSelector, targetSelector, position) {
    const handle = domQuery(handleSelector, testContainer);

    const target = domQuery(targetSelector, testContainer);

    const bounds = target.getBoundingClientRect();

    const dataTransfer = { setDragImage() {} };

    const clientX = bounds.left + (position === 'right' ? bounds.width : 0),
          clientY = bounds.top + (position === 'bottom' ? bounds.height : 0);

    triggerEvent(handle, 'dragstart', { dataTransfer });
    triggerEvent(target, 'dragover', { dataTransfer, clientX, clientY });
    triggerEvent(target, 'drop', { dataTransfer, clientX, clientY });
  }

});


function triggerEvent(element, type, data = {}) {
  const event = document.createEvent('Event');

  event.initEvent(type, true, true);

  Object.assign(event, data);

  element.dispatchEvent(event);
}
