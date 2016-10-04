'use strict';

require('../../TestHelper');

var domQuery = require('min-dom/lib/query');

/* global bootstrapModeler, inject */

var basicXML = require('../../../../fixtures/dmn/new-table.dmn');


describe('features/editor-actions', function() {

  beforeEach(bootstrapModeler(basicXML));

  it('should make registered actions available', inject(function(editorActions) {
    expect(editorActions._actions).to.be.an('object');
  }));


  describe('trigger', function() {

    it('should trigger an action', inject(function(modeling, editorActions) {
      // given
      modeling.createRow({ id: 'test' });

      // when
      editorActions.trigger('undo');

      // then
      expect(domQuery.all('tbody > tr[data-element-id=test]').length).to.eql(0);
    }));


    it('should not trigger non-existing actions', inject(function(modeling, editorActions) {
      // when
      function trigger() {
        editorActions.trigger('non-registered-action');
      }

      // then
      expect(trigger).to.throw('non-registered-action is not a registered action');
    }));

  });


  describe('register actions', function() {

    it('should register a list of actions', inject(function(editorActions) {
      // given
      var numOfActions = editorActions.length();

      // when
      editorActions.register({
        'foo': function() {
          return 'bar';
        },
        'bar': function() {
          return 'foo';
        }
      });

      // then
      expect(editorActions.length()).to.equal(numOfActions + 2);
    }));


    it('should register action', inject(function(editorActions) {
      // when
      editorActions.register('foo', function() {
        return 'bar';
      });

      // then
      expect(editorActions.trigger('foo')).to.equal('bar');
      expect(editorActions.isRegistered('foo')).to.be.true;
    }));


    it('should throw error on duplicate registration', inject(function(editorActions) {
      // when
      function register() {
        editorActions.register('undo', function() {
          return 'bar';
        });
      }

      // then
      expect(register).to.throw('undo is already registered');
    }));


    it('should unregister an action', inject(function(editorActions) {
      // when
      editorActions.unregister('undo');

      // then
      expect(editorActions.isRegistered('undo')).to.be.false;
    }));


    it('should throw an error on deregisering unregistered', inject(function(editorActions) {
      // when
      function unregister() {
        editorActions.unregister('bar');
      }

      // then
      expect(unregister).to.throw('bar is not a registered action');
    }));

  });


  describe('utilities', function() {

    it('listActions', inject(function(editorActions) {
      // given
      var keys = Object.keys(editorActions._actions);

      // when
      var actionsLength = editorActions.length();

      // then
      expect(actionsLength).to.equal(keys.length);
    }));


    it('isRegistered -> true', inject(function(editorActions) {
      // when
      var undo = editorActions.isRegistered('undo'),
          foo = editorActions.isRegistered('foo');

      // then
      expect(undo).to.be.true;
      expect(foo).to.be.false;
    }));

  });


  describe('default action', function() {

    it('should have default actions', inject(function(editorActions) {
      // expect
      expect(editorActions.isRegistered('undo')).to.be.true;
      expect(editorActions.isRegistered('redo')).to.be.true;
      expect(editorActions.isRegistered('ruleAdd')).to.be.true;
      expect(editorActions.isRegistered('ruleAddAbove')).to.be.true;
      expect(editorActions.isRegistered('ruleAddBelow')).to.be.true;
      expect(editorActions.isRegistered('ruleClear')).to.be.true;
      expect(editorActions.isRegistered('ruleRemove')).to.be.true;
      expect(editorActions.isRegistered('clauseAdd')).to.be.true;
      expect(editorActions.isRegistered('clauseAddLeft')).to.be.true;
      expect(editorActions.isRegistered('clauseAddRight')).to.be.true;
      expect(editorActions.isRegistered('clauseRemove')).to.be.true;
    }));


    it('should add a rule', inject(function(editorActions) {
      // given
      var amount = domQuery.all('tbody > tr').length;

      // when
      editorActions.trigger('ruleAdd');

      // then
      expect(domQuery.all('tbody > tr').length).to.eql(amount + 1);
    }));


    it('should add rule above selection', inject(function(editorActions, selection, elementRegistry, modeling) {
      // given
      // by default input1, output1 and annotations are the existing columns
      modeling.createRow({ id: 'row1' });

      var element = elementRegistry.get('cell_input1_row1'),
          row = element.parent,
          amount = domQuery.all('tbody > tr').length;

      // when
      selection.select(element);
      editorActions.trigger('ruleAddAbove');

      // then
      expect(domQuery.all('tbody > tr').length).to.eql(amount + 1);
      expect(row.previousElementSibling).to.be.ok;
    }));


    it('should add rule below selection', inject(function(editorActions, selection, elementRegistry, modeling) {
      // given
      // by default input1, output1 and annotations are the existing columns
      modeling.createRow({ id: 'row1' });
      var element = elementRegistry.get('cell_input1_row1'),
          row = element.parent,
          amount = domQuery.all('tbody > tr').length;

      // when
      selection.select(element);
      editorActions.trigger('ruleAddBelow');

      // then
      expect(domQuery.all('tbody > tr').length).to.eql(amount + 1);
      expect(row.nextElementSibling).to.be.ok;
    }));


    it('should copy a rule', inject(function(editorActions, selection, modeling, elementRegistry) {
      // given
      modeling.createRow({ id: 'row1' });

      modeling.editCell('row1', 'input1', '"foo"');

      modeling.createRow({ id: 'row2' });

      var row1 = elementRegistry.get('cell_input1_row1'),
          row2 = elementRegistry.get('cell_input1_row2'),
          newRow;

      selection.select(row1);

      // when
      editorActions.trigger('ruleCopy');

      newRow = row2.row.next;

      // then
      expect(newRow).to.exist;
      expect(newRow.businessObject.inputEntry[0].text).to.eql('"foo"');
    }));


    it('should copy rule above selection', inject(function(editorActions, selection, elementRegistry, modeling) {
      // given
      modeling.createRow({ id: 'row1' });
      modeling.createRow({ id: 'row2' });

      modeling.editCell('row2', 'input1', '"foo"');

      var row1 = elementRegistry.get('cell_input1_row1'),
          row2 = elementRegistry.get('cell_input1_row2'),
          newRow;

      selection.select(row2);

      // when
      editorActions.trigger('ruleCopyAbove');

      newRow = row1.row.next;

      // then
      expect(newRow).to.exist;
      expect(newRow.businessObject.inputEntry[0].text).to.eql('"foo"');
    }));


    it('should copy rule below selection', inject(function(editorActions, selection, elementRegistry, modeling) {
      // given
      modeling.createRow({ id: 'row1' });

      modeling.editCell('row1', 'input1', '"foo"');

      modeling.createRow({ id: 'row2' });

      var row1 = elementRegistry.get('cell_input1_row1'),
          newRow;

      selection.select(row1);

      // when
      editorActions.trigger('ruleCopyBelow');

      newRow = row1.row.next;

      // then
      expect(newRow).to.exist;
      expect(newRow.businessObject.inputEntry[0].text).to.eql('"foo"');
    }));


    it('should clear a rule', inject(function(editorActions, selection, elementRegistry, modeling) {
      // given
      // by default input1, output1 and annotations are the existing columns
      modeling.createRow({ id: 'row1' });

      var input1 = elementRegistry.get('cell_input1_row1'),
          output1 = elementRegistry.get('cell_output1_row1');


      input1.content.text = 'foo';
      output1.content.text = 'bar';

      // when
      selection.select(input1);
      editorActions.trigger('ruleClear');

      // then
      expect(input1.content.text).to.eql('');
      expect(output1.content.text).to.eql('');
    }));


    it('should remove a rule', inject(function(editorActions, selection, elementRegistry, modeling) {
      // given
      // by default input1, output1 and annotations are the existing columns
      modeling.createRow({ id: 'row1' });

      var element = elementRegistry.get('cell_input1_row1'),
          amount = domQuery.all('tbody > tr').length;

      // when
      selection.select(element);
      editorActions.trigger('ruleRemove');

      // then
      expect(domQuery.all('tbody > tr').length).to.eql(amount - 1);
    }));


    it('should add a clause', inject(function(editorActions, selection, modeling, elementRegistry) {
      // given
      // by default input1, output1 and annotations are the existing columns
      modeling.createRow({ id: 'row1' });

      var element = elementRegistry.get('cell_input1_row1'),
          amount = domQuery.all('tbody > tr > td.input').length;

      selection.select(element);

      // when
      editorActions.trigger('clauseAdd', 'input');

      // then
      expect(domQuery.all('tbody > tr > td.input').length).to.eql(amount + 1);
    }));


    it('should add a clause at the left', inject(function(editorActions, selection, modeling, elementRegistry) {
      // given
      // by default input1, output1 and annotations are the existing columns
      modeling.createRow({ id: 'row1' });
      var element = elementRegistry.get('cell_input1_row1'),
          domElement = element.parent,  // this is the <tr> element
          amount = domElement.children.length;

      selection.select(element);

      // when
      editorActions.trigger('clauseAddLeft');

      // then
      expect(domElement.children.length).to.eql(amount + 1);
      // columns should be [utilityColumn, new column, original column, …] now
      expect(domElement.children[2].getAttribute('data-element-id')).to.eql('cell_input1_row1');
    }));


    it('should add a clause at the right', inject(function(editorActions, selection, modeling, elementRegistry) {
      // given
      // by default input1, output1 and annotations are the existing columns
      modeling.createRow({ id: 'row1' });

      var element = elementRegistry.get('cell_input1_row1'),
          domElement = element.parent,  // this is the <tr> element
          amount = domElement.children.length;

      selection.select(element);

      // when
      editorActions.trigger('clauseAddRight');

      // then
      expect(domElement.children.length).to.eql(amount + 1);
      // columns should be [utilityColumn, original column, new column, …] now
      expect(domElement.children[2].classList.contains('input')).to.be.true;
    }));


    it('should remove a clause', inject(function(editorActions, selection, modeling, elementRegistry) {
      // given
      // by default input1, output1 and annotations are the existing columns
      modeling.createRow({ id: 'row1' });

      var element = elementRegistry.get('cell_input1_row1'),
          amount;

      selection.select(element);
      editorActions.trigger('clauseAdd', 'input');

      amount = domQuery.all('tbody > tr > td.input').length;

      // when
      selection.select(element);
      editorActions.trigger('clauseRemove');

      // then
      expect(domQuery.all('tbody > tr > td.input').length).to.eql(amount - 1);
    }));


    it('should toggle between modes', inject(function(editorActions, simpleMode) {
      // given
      var initial = simpleMode.isActive();

      // when
      editorActions.trigger('toggleEditingMode');

      // then
      expect(simpleMode.isActive()).to.be.false;
      expect(simpleMode.isActive()).to.not.eql(initial);

      // given
      initial = simpleMode.isActive();

      // when
      editorActions.trigger('toggleEditingMode');

      // then
      expect(simpleMode.isActive()).to.be.true;
      expect(simpleMode.isActive()).to.not.eql(initial);
    }));

  });

});
