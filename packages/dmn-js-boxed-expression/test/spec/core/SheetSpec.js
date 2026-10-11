import { expect } from 'chai';
import * as sinon from 'sinon';

import { bootstrapModeler, inject } from 'test/helper';

import { addRoot, createCol, createRow } from 'test/helper/RootUtil';

import simpleXML from '../simple.dmn';


describe('core/Sheet', function() {

  beforeEach(bootstrapModeler(simpleXML));


  describe('roots', function() {

    it('should keep primary root', inject(function(injector, sheet) {

      // given
      const primary = sheet.getRoot();

      // when
      addRoot(injector);

      // then
      expect(sheet.getRoot()).to.equal(primary);
    }));


    it('should return all roots, primary first', inject(function(injector, sheet) {

      // given
      const primary = sheet.getRoot();

      // when
      const root = addRoot(injector);

      // then
      expect(sheet.getRoots()).to.eql([ primary, root ]);
    }));


    it('should fire <sheet.rootAdded>', inject(function(injector, eventBus, sheet) {

      // given
      const listener = sinon.spy();

      eventBus.on('sheet.rootAdded', listener);

      // when
      const root = addRoot(injector);

      // then
      expect(listener).to.have.been.calledOnce;
      expect(listener.firstCall.args[0].root).to.equal(root);
    }));


    it('should NOT fire <root.add>', inject(function(injector, eventBus, sheet) {

      // given
      const listener = sinon.spy();

      eventBus.on('root.add', listener);

      // when
      addRoot(injector);

      // then
      expect(listener).not.to.have.been.called;
    }));


    it('should remove root', inject(function(injector, sheet) {

      // given
      const primary = sheet.getRoot();
      const root = addRoot(injector);

      // when
      sheet.removeRoot(root);

      // then
      expect(sheet.getRoots()).to.eql([ primary ]);
    }));


    it('should unregister elements of removed root', inject(
      function(injector, elementRegistry, sheet) {

        // given
        const root = addRoot(injector);

        const { cols, rows } = root;

        // when
        sheet.removeRoot(root);

        // then
        expect(elementRegistry.get(cols[0].id)).not.to.exist;
        expect(elementRegistry.get(rows[0].id)).not.to.exist;
        expect(elementRegistry.get(rows[0].cells[0].id)).not.to.exist;
      }
    ));


    it('should fire <sheet.rootRemoved>', inject(
      function(injector, eventBus, sheet) {

        // given
        const listener = sinon.spy();

        const root = addRoot(injector);

        eventBus.on('sheet.rootRemoved', listener);

        // when
        sheet.removeRoot(root);

        // then
        expect(listener).to.have.been.calledOnce;
        expect(listener.firstCall.args[0].root).to.equal(root);
      }
    ));


    it('should remove primary root', inject(function(injector, sheet) {

      // given
      const root = addRoot(injector);

      // when
      sheet.removeRoot(sheet.getRoot());

      // then
      expect(sheet.getRoots()).to.eql([ root ]);
    }));


    it('should promote next root to primary root', inject(function(injector, sheet) {

      // given
      const root = addRoot(injector);

      // when
      sheet.removeRoot(sheet.getRoot());

      // then
      expect(sheet.getRoot()).to.equal(root);
    }));


    it('should unregister elements of removed primary root', inject(
      function(elementRegistry, sheet) {

        // given
        const primary = sheet.getRoot();

        const { cols, rows } = primary;

        // when
        sheet.removeRoot(primary);

        // then
        expect(elementRegistry.get(cols[0].id)).not.to.exist;
        expect(elementRegistry.get(rows[0].id)).not.to.exist;
        expect(elementRegistry.get(rows[0].cells[0].id)).not.to.exist;
      }
    ));


    it('should fire <sheet.rootRemoved> for primary root', inject(
      function(eventBus, sheet) {

        // given
        const listener = sinon.spy();

        const primary = sheet.getRoot();

        eventBus.on('sheet.rootRemoved', listener);

        // when
        sheet.removeRoot(primary);

        // then
        expect(listener).to.have.been.calledOnce;
        expect(listener.firstCall.args[0].root).to.equal(primary);
      }
    ));


    it('should ignore unknown root', inject(function(injector, sheet) {

      // given
      const roots = sheet.getRoots();

      // when
      sheet.removeRoot({ rows: [], cols: [] });

      // then
      expect(sheet.getRoots()).to.eql(roots);
    }));


    it('should clear roots on <table.clear>', inject(
      function(injector, eventBus, sheet) {

        // given
        addRoot(injector);

        // when
        eventBus.fire('table.clear');

        // then
        expect(sheet.getRoots()).to.be.empty;
      }
    ));

  });


  describe('#getRootOf', function() {

    let root;

    beforeEach(inject(function(injector, sheet) {
      root = addRoot(injector);
    }));


    it('should return root', inject(function(sheet) {
      expect(sheet.getRootOf(root)).to.equal(root);
    }));


    it('should return root of row', inject(function(sheet) {
      expect(sheet.getRootOf(root.rows[0])).to.equal(root);
    }));


    it('should return root of col', inject(function(sheet) {
      expect(sheet.getRootOf(root.cols[0])).to.equal(root);
    }));


    it('should return root of cell', inject(function(sheet) {
      expect(sheet.getRootOf(root.rows[1].cells[1])).to.equal(root);
    }));


    it('should return primary root', inject(function(sheet) {
      expect(sheet.getRootOf(sheet.getRoot().rows[0])).to.equal(sheet.getRoot());
    }));


    it('should return nothing for unknown element', inject(function(sheet) {
      expect(sheet.getRootOf({})).not.to.exist;
    }));

  });


  describe('rows', function() {

    let root, primaryRowCount;

    beforeEach(inject(function(injector, sheet) {
      root = addRoot(injector);

      primaryRowCount = sheet.getRoot().rows.length;
    }));


    it('should add row to root', inject(function(elementFactory, sheet) {

      // given
      const row = createRow(elementFactory, root);

      // when
      sheet.addRow(row, 1, root);

      // then
      expect(root.rows[1]).to.equal(row);
      expect(row.root).to.equal(root);
    }));


    it('should NOT add row to primary root', inject(function(elementFactory, sheet) {

      // when
      sheet.addRow(createRow(elementFactory, root), 1, root);

      // then
      expect(sheet.getRoot().rows).to.have.length(primaryRowCount);
    }));


    it('should add row to primary root per default', inject(
      function(elementFactory, sheet) {

        // given
        const row = createRow(elementFactory, sheet.getRoot());

        // when
        sheet.addRow(row);

        // then
        expect(row.root).to.equal(sheet.getRoot());
      }
    ));


    it('should fire <row.add> with root', inject(
      function(elementFactory, eventBus, sheet) {

        // given
        const listener = sinon.spy();

        eventBus.on('row.add', listener);

        // when
        sheet.addRow(createRow(elementFactory, root), 0, root);

        // then
        expect(listener.firstCall.args[0].root).to.equal(root);
      }
    ));


    it('should remove row from its root', inject(function(sheet) {

      // given
      const row = root.rows[0];

      // when
      sheet.removeRow(row);

      // then
      expect(root.rows).to.have.length(1);
      expect(row.root).not.to.exist;
    }));


    it('should NOT remove row from primary root', inject(function(sheet) {

      // when
      sheet.removeRow(root.rows[0]);

      // then
      expect(sheet.getRoot().rows).to.have.length(primaryRowCount);
    }));


    it('should ignore unknown row id', inject(function(sheet) {

      // when
      sheet.removeRow('unknown');

      // then
      expect(root.rows).to.have.length(2);
    }));


    it('should remove row by id', inject(function(sheet) {

      // given
      const { id } = root.rows[0];

      // when
      sheet.removeRow(id);

      // then
      expect(root.rows).to.have.length(1);
    }));


    it('should fire <row.remove> with root', inject(function(eventBus, sheet) {

      // given
      const listener = sinon.spy();

      eventBus.on('row.remove', listener);

      // when
      sheet.removeRow(root.rows[0]);

      // then
      expect(listener.firstCall.args[0].root).to.equal(root);
    }));


    it('should update cells of cols', inject(function(elementFactory, sheet) {

      // given
      const row = createRow(elementFactory, root);

      // when
      sheet.addRow(row, 0, root);

      // then
      expect(root.cols[0].cells[0]).to.equal(row.cells[0]);
      expect(root.cols[1].cells[0]).to.equal(row.cells[1]);
    }));

  });


  describe('cols', function() {

    let root, primaryColCount;

    beforeEach(inject(function(injector, sheet) {
      root = addRoot(injector);

      primaryColCount = sheet.getRoot().cols.length;
    }));


    it('should add col to root', inject(function(elementFactory, sheet) {

      // given
      const col = createCol(elementFactory, root);

      // when
      sheet.addCol(col, 1, root);

      // then
      expect(root.cols[1]).to.equal(col);
      expect(col.root).to.equal(root);
    }));


    it('should NOT add col to primary root', inject(function(elementFactory, sheet) {

      // when
      sheet.addCol(createCol(elementFactory, root), 1, root);

      // then
      expect(sheet.getRoot().cols).to.have.length(primaryColCount);
    }));


    it('should fire <col.add> with root', inject(
      function(elementFactory, eventBus, sheet) {

        // given
        const listener = sinon.spy();

        eventBus.on('col.add', listener);

        // when
        sheet.addCol(createCol(elementFactory, root), 0, root);

        // then
        expect(listener.firstCall.args[0].root).to.equal(root);
      }
    ));


    it('should remove col from its root', inject(function(sheet) {

      // given
      const col = root.cols[0];

      // when
      sheet.removeCol(col);

      // then
      expect(root.cols).to.have.length(1);
      expect(col.root).not.to.exist;
    }));


    it('should NOT remove col from primary root', inject(function(sheet) {

      // when
      sheet.removeCol(root.cols[0]);

      // then
      expect(sheet.getRoot().cols).to.have.length(primaryColCount);
    }));


    it('should ignore unknown col id', inject(function(sheet) {

      // when
      sheet.removeCol('unknown');

      // then
      expect(root.cols).to.have.length(2);
    }));


    it('should fire <col.remove> with root', inject(function(eventBus, sheet) {

      // given
      const listener = sinon.spy();

      eventBus.on('col.remove', listener);

      // when
      sheet.removeCol(root.cols[0]);

      // then
      expect(listener.firstCall.args[0].root).to.equal(root);
    }));

  });


  describe('resized', function() {

    it('should fire <sheet.resized> with root', inject(function(eventBus, sheet) {

      // given
      const listener = sinon.spy();

      eventBus.on('sheet.resized', listener);

      // when
      sheet.resized(sheet.getRoot());

      // then
      expect(listener.firstCall.args[0].root).to.equal(sheet.getRoot());
    }));

  });

});
