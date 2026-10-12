import { expect } from 'chai';

import { bootstrapModeler, inject } from 'test/helper';

import { addRoot } from 'test/helper/RootUtil';

import simpleXML from '../../simple.dmn';


describe('features/modeling - multiple roots', function() {

  let primary, root, dirty;

  beforeEach(bootstrapModeler(simpleXML));

  beforeEach(inject(function(injector, eventBus, sheet) {
    primary = sheet.getRoot();
    root = addRoot(injector);

    dirty = [];

    eventBus.on('elements.changed', ({ elements }) => dirty.push(...elements));
  }));


  describe('rows', function() {

    describe('add', function() {

      it('should add row to root', inject(function(modeling) {

        // when
        const row = modeling.addRow({ type: 'dmn:DecisionRule' }, 1, root);

        // then
        expect(root.rows[1]).to.equal(row);
        expect(row.cells).to.have.length(2);
      }));


      it('should NOT add row to primary root', inject(function(modeling) {

        // given
        const rows = primary.rows.length;

        // when
        modeling.addRow({ type: 'dmn:DecisionRule' }, 1, root);

        // then
        expect(primary.rows).to.have.length(rows);
      }));


      it('should add row to primary root per default', inject(function(modeling) {

        // when
        const row = modeling.addRow({ type: 'dmn:DecisionRule' }, 0);

        // then
        expect(primary.rows[0]).to.equal(row);
      }));


      it('should update table of root', inject(function(modeling) {

        // when
        const row = modeling.addRow({ type: 'dmn:DecisionRule' }, 1, root);

        // then
        expect(root.businessObject.rule[1]).to.equal(row.businessObject);
      }));


      it('should NOT update table of primary root', inject(function(modeling) {

        // given
        const rules = primary.businessObject.rule.length;

        // when
        modeling.addRow({ type: 'dmn:DecisionRule' }, 1, root);

        // then
        expect(primary.businessObject.rule).to.have.length(rules);
      }));


      it('should mark root dirty', inject(function(modeling) {

        // when
        modeling.addRow({ type: 'dmn:DecisionRule' }, 1, root);

        // then
        expect(dirty).to.eql([ root ]);
      }));


      it('should undo', inject(function(commandStack, modeling) {

        // given
        const row = modeling.addRow({ type: 'dmn:DecisionRule' }, 1, root);

        // when
        commandStack.undo();

        // then
        expect(root.rows).to.have.length(2);
        expect(root.rows).not.to.include(row);
      }));


      it('should mark root dirty on undo', inject(function(commandStack, modeling) {

        // given
        modeling.addRow({ type: 'dmn:DecisionRule' }, 1, root);

        dirty = [];

        // when
        commandStack.undo();

        // then
        expect(dirty).to.eql([ root ]);
      }));


      it('should redo', inject(function(commandStack, modeling) {

        // given
        const row = modeling.addRow({ type: 'dmn:DecisionRule' }, 1, root);

        commandStack.undo();

        // when
        commandStack.redo();

        // then
        expect(root.rows[1]).to.equal(row);
      }));

    });


    describe('remove', function() {

      it('should remove row from its root', inject(function(modeling) {

        // given
        const row = root.rows[0];

        // when
        modeling.removeRow(row);

        // then
        expect(root.rows).to.have.length(1);
        expect(root.rows).not.to.include(row);
      }));


      it('should update table of root', inject(function(modeling) {

        // given
        const row = root.rows[0];

        // when
        modeling.removeRow(row);

        // then
        expect(root.businessObject.rule).not.to.include(row.businessObject);
      }));


      it('should NOT remove row from primary root', inject(function(modeling) {

        // given
        const rows = primary.rows.length;

        // when
        modeling.removeRow(root.rows[0]);

        // then
        expect(primary.rows).to.have.length(rows);
      }));


      it('should mark root dirty', inject(function(modeling) {

        // when
        modeling.removeRow(root.rows[0]);

        // then
        expect(dirty).to.eql([ root ]);
      }));


      it('should undo', inject(function(commandStack, modeling) {

        // given
        const [ first, second ] = root.rows;

        modeling.removeRow(first);

        // when
        commandStack.undo();

        // then
        expect(root.rows).to.eql([ first, second ]);
        expect(first.root).to.equal(root);
      }));


      it('should fail for row without root', inject(function(elementFactory, modeling) {

        // given
        const row = elementFactory.createRow({ type: 'dmn:DecisionRule', cells: [] });

        // then
        expect(function() {
          modeling.removeRow(row);
        }).to.throw(/not in sheet/);
      }));

    });


    describe('move', function() {

      it('should move row within its root', inject(function(modeling) {

        // given
        const [ first, second ] = root.rows;

        // when
        modeling.moveRow(first, 1);

        // then
        expect(root.rows).to.eql([ second, first ]);
      }));


      it('should NOT move row to primary root', inject(function(modeling) {

        // given
        const rows = primary.rows.length;

        // when
        modeling.moveRow(root.rows[0], 1);

        // then
        expect(primary.rows).to.have.length(rows);
      }));


      it('should undo', inject(function(commandStack, modeling) {

        // given
        const [ first, second ] = root.rows;

        modeling.moveRow(first, 1);

        // when
        commandStack.undo();

        // then
        expect(root.rows).to.eql([ first, second ]);
      }));

    });

  });


  describe('cols', function() {

    describe('add', function() {

      it('should add col to root', inject(function(modeling) {

        // when
        const col = modeling.addCol({ type: 'dmn:InputClause' }, 1, root);

        // then
        expect(root.cols[1]).to.equal(col);
        expect(col.cells).to.have.length(2);
      }));


      it('should NOT add col to primary root', inject(function(modeling) {

        // given
        const cols = primary.cols.length;

        // when
        modeling.addCol({ type: 'dmn:InputClause' }, 1, root);

        // then
        expect(primary.cols).to.have.length(cols);
      }));


      it('should add col to primary root per default', inject(function(modeling) {

        // when
        const col = modeling.addCol({ type: 'dmn:InputClause' }, 0);

        // then
        expect(primary.cols[0]).to.equal(col);
      }));


      it('should update table of root', inject(function(modeling) {

        // when
        const col = modeling.addCol({ type: 'dmn:InputClause' }, 0, root);

        // then
        expect(root.businessObject.input[0]).to.equal(col.businessObject);
      }));


      it('should mark root dirty', inject(function(modeling) {

        // when
        modeling.addCol({ type: 'dmn:InputClause' }, 1, root);

        // then
        expect(dirty).to.eql([ root ]);
      }));


      it('should undo', inject(function(commandStack, modeling) {

        // given
        const col = modeling.addCol({ type: 'dmn:InputClause' }, 1, root);

        // when
        commandStack.undo();

        // then
        expect(root.cols).to.have.length(2);
        expect(root.cols).not.to.include(col);
      }));

    });


    describe('remove', function() {

      it('should remove col from its root', inject(function(modeling) {

        // given
        const col = root.cols[0];

        // when
        modeling.removeCol(col);

        // then
        expect(root.cols).to.have.length(1);
        expect(root.cols).not.to.include(col);
      }));


      it('should NOT remove col from primary root', inject(function(modeling) {

        // given
        const cols = primary.cols.length;

        // when
        modeling.removeCol(root.cols[0]);

        // then
        expect(primary.cols).to.have.length(cols);
      }));


      it('should undo', inject(function(commandStack, modeling) {

        // given
        const [ first, second ] = root.cols;

        modeling.removeCol(first);

        // when
        commandStack.undo();

        // then
        expect(root.cols).to.eql([ first, second ]);
        expect(first.root).to.equal(root);
      }));

    });


    describe('move', function() {

      it('should move col within its root', inject(function(modeling) {

        // given
        const [ first, second ] = root.cols;

        // when
        modeling.moveCol(first, 1);

        // then
        expect(root.cols).to.eql([ second, first ]);
      }));


      it('should undo', inject(function(commandStack, modeling) {

        // given
        const [ first, second ] = root.cols;

        modeling.moveCol(first, 1);

        // when
        commandStack.undo();

        // then
        expect(root.cols).to.eql([ first, second ]);
      }));

    });

  });


  describe('undo', function() {

    it('should undo edits of both roots in reverse order', inject(
      function(commandStack, modeling) {

        // given
        const primaryRows = primary.rows.length;

        modeling.addRow({ type: 'dmn:DecisionRule' }, 0);
        modeling.addRow({ type: 'dmn:DecisionRule' }, 0, root);

        // when
        commandStack.undo();
        commandStack.undo();

        // then
        expect(root.rows).to.have.length(2);
        expect(primary.rows).to.have.length(primaryRows);
      }
    ));

  });

});
