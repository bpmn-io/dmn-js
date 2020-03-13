import { bootstrapModeler, inject } from 'test/helper';

import simpleXML from '../../simple.dmn';

import CoreModule from 'src/core';
import EditorActionsModule from 'src/features/editor-actions';
import ModelingModule from 'src/features/modeling';
import RulesEditorModule from 'src/features/decision-rules/editor';

describe('features/editor-actions', function() {

  let rule1, rule2, rule3, rule4, input1, input2, output1, output2, root;

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      EditorActionsModule,
      ModelingModule,
      RulesEditorModule
    ]
  }));

  beforeEach(inject(function(sheet) {
    root = sheet.getRoot();

    const { rows, cols } = root;

    rule1 = rows[0];
    rule2 = rows[1];
    rule3 = rows[2];
    rule4 = rows[3];

    input1 = cols[0];
    input2 = cols[1];
    output1 = cols[2];
    output2 = cols[3];
  }));


  it('addRule', inject(function(editorActions) {

    // when
    const rule = editorActions.trigger('addRule');

    // then
    expect(root.rows).to.have.lengthOf(5);

    expectOrder(root.rows, [
      rule1,
      rule2,
      rule3,
      rule4,
      rule
    ]);
  }));


  it('addRuleAbove - specified', inject(function(editorActions) {

    // when
    const rule = editorActions.trigger('addRuleAbove', { rule: rule1 });

    // then
    expect(root.rows).to.have.lengthOf(5);

    expectOrder(root.rows, [
      rule,
      rule1,
      rule2,
      rule3
    ]);
  }));


  it('addRuleAbove - selected', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry1');

    // when
    const rule = editorActions.trigger('addRuleAbove');

    // then
    expect(root.rows).to.have.lengthOf(5);

    expectOrder(root.rows, [
      rule,
      rule1,
      rule2,
      rule3
    ]);
  }));


  it('addRuleBelow - specified', inject(function(editorActions) {

    // when
    const rule = editorActions.trigger('addRuleBelow', { rule: rule1 });

    // then
    expect(root.rows).to.have.lengthOf(5);

    expectOrder(root.rows, [
      rule1,
      rule,
      rule2,
      rule3,
      rule4
    ]);
  }));


  it('addRuleBelow - selected', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry1');

    // when
    const rule = editorActions.trigger('addRuleBelow');

    // then
    expect(root.rows).to.have.lengthOf(5);

    expectOrder(root.rows, [
      rule1,
      rule,
      rule2,
      rule3,
      rule4
    ]);
  }));


  it('removeRule - specified', inject(function(editorActions) {

    // when
    editorActions.trigger('removeRule', { rule: rule1 });

    // then
    expect(root.rows).to.have.lengthOf(3);

    expectOrder(root.rows, [
      rule2,
      rule3,
      rule4
    ]);
  }));


  it('removeRule - selected', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry1');

    // when
    editorActions.trigger('removeRule');

    // then
    expect(root.rows).to.have.lengthOf(3);

    expectOrder(root.rows, [
      rule2,
      rule3,
      rule4
    ]);
  }));


  it('addInput', inject(function(editorActions) {

    // when
    const input = editorActions.trigger('addInput');

    // then
    expectOrder(root.cols, [
      input1,
      input2,
      input,
      output1,
      output2
    ]);
  }));


  it('addInputLeft - specified', inject(function(editorActions) {

    // when
    const input = editorActions.trigger('addInputLeft', { input: input1 });

    // then
    expectOrder(root.cols, [
      input,
      input1,
      input2,
      output1,
      output2
    ]);
  }));


  it('addInputLeft - selected', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry1');

    // when
    const input = editorActions.trigger('addInputLeft');

    // then
    expectOrder(root.cols, [
      input,
      input1,
      input2,
      output1,
      output2
    ]);
  }));


  it('addInputRight - specified', inject(function(editorActions) {

    // when
    const input = editorActions.trigger('addInputRight', { input: input1 });

    // then
    expectOrder(root.cols, [
      input1,
      input,
      input2,
      output1,
      output2
    ]);
  }));


  it('addInputRight - selected', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry1');

    // when
    const input = editorActions.trigger('addInputRight');

    // then
    expectOrder(root.cols, [
      input1,
      input,
      input2,
      output1,
      output2
    ]);
  }));


  it('removeInput - specified', inject(function(editorActions) {

    // when
    editorActions.trigger('removeInput', { input: input1 });

    // then
    expectOrder(root.cols, [
      input2,
      output1,
      output2
    ]);
  }));


  it('removeInput - selected', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry1');

    // when
    editorActions.trigger('removeInput');

    // then
    expectOrder(root.cols, [
      input2,
      output1,
      output2
    ]);
  }));


  it('addOutput', inject(function(editorActions) {

    // when
    const output = editorActions.trigger('addOutput');

    // then
    expectOrder(root.cols, [
      input1,
      input2,
      output1,
      output2,
      output
    ]);
  }));


  it('addOutputLeft - specified', inject(function(editorActions) {

    // when
    const output = editorActions.trigger('addOutputLeft', { output: output1 });

    // then
    expectOrder(root.cols, [
      input1,
      input2,
      output,
      output1,
      output2
    ]);
  }));


  it('addOutputLeft - selected', inject(function(editorActions, selection) {

    // given
    selection.select('outputEntry1');

    // when
    const output = editorActions.trigger('addOutputLeft');

    // then
    expectOrder(root.cols, [
      input1,
      input2,
      output,
      output1,
      output2
    ]);
  }));


  it('addOutputRight - specified', inject(function(editorActions) {

    // when
    const output = editorActions.trigger('addOutputRight', { output: output1 });

    // then
    expectOrder(root.cols, [
      input1,
      input2,
      output1,
      output,
      output2
    ]);
  }));


  it('addOutputRight - selected', inject(function(editorActions, selection) {

    // given
    selection.select('outputEntry1');

    // when
    const output = editorActions.trigger('addOutputRight');

    // then
    expectOrder(root.cols, [
      input1,
      input2,
      output1,
      output,
      output2
    ]);
  }));


  it('removeOutput - specified', inject(function(editorActions) {

    // when
    editorActions.trigger('removeOutput', { output: output1 });

    // then
    expectOrder(root.cols, [
      input1,
      input2,
      output2
    ]);
  }));


  it('removeOutput - selected', inject(function(editorActions, selection) {

    // given
    selection.select('outputEntry1');

    // when
    editorActions.trigger('removeOutput');

    // then
    expectOrder(root.cols, [
      input1,
      input2,
      output2
    ]);
  }));


  it('addClause', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry1');

    // when
    const clause = editorActions.trigger('addClause');

    // then
    expectOrder(root.cols, [
      input1,
      input2,
      clause,
      output1,
      output2
    ]);
  }));


  it('addClauseLeft', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry1');

    // when
    const clause = editorActions.trigger('addClauseLeft');

    // then
    expectOrder(root.cols, [
      clause,
      input1,
      input2,
      output1,
      output2
    ]);
  }));


  it('addClauseRight', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry1');

    // when
    const clause = editorActions.trigger('addClauseRight');

    // then
    expectOrder(root.cols, [
      input1,
      clause,
      input2,
      output1,
      output2
    ]);
  }));


  it('removeClause', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry1');

    // when
    editorActions.trigger('removeClause');

    // then
    expectOrder(root.cols, [
      input2,
      output1,
      output2
    ]);
  }));


  it('copy', inject(function(clipboard, editorActions, elementRegistry) {

    // given
    const element = elementRegistry.get('rule1');

    // when
    editorActions.trigger('copy', {
      element
    });

    // then
    expect(clipboard.isEmpty()).to.be.false;
  }));


  it('cut', inject(function(clipboard, editorActions, elementRegistry) {

    // given
    const element = elementRegistry.get('rule1');

    // when
    editorActions.trigger('cut', {
      element
    });

    // then
    expect(clipboard.isEmpty()).to.be.false;

    expectOrder(root.rows, [
      rule2,
      rule3,
      rule4
    ]);
  }));


  it('pasteBefore', inject(function(editorActions, elementRegistry) {

    // given
    const rule1 = elementRegistry.get('rule1'),
          rule4 = elementRegistry.get('rule4');

    // when
    // empty clipboard + paste
    const notPasted = editorActions.trigger('pasteBefore', {
      element: rule4
    });

    // then
    expect(notPasted).to.be.undefined;

    // given
    editorActions.trigger('cut', {
      element: rule1
    });

    // when
    // actual clipboard contents + paste
    const pasted = editorActions.trigger('pasteBefore', {
      element: rule4
    });

    // then
    const newRule1 = elementRegistry.get('rule1');

    expect(pasted).to.be.true;

    expectOrder(root.rows, [
      rule2,
      rule3,
      newRule1,
      rule4
    ]);
  }));


  it('pasteAfter', inject(function(editorActions, elementRegistry) {

    // given
    const rule1 = elementRegistry.get('rule1'),
          rule4 = elementRegistry.get('rule4');

    // when
    // empty clipboard + paste
    const notPasted = editorActions.trigger('pasteBefore', {
      element: rule4
    });

    // then
    expect(notPasted).to.be.undefined;

    // given
    editorActions.trigger('cut', {
      element: rule1
    });

    // when
    // actual clipboard contents + paste
    const pasted = editorActions.trigger('pasteAfter', {
      element: rule4
    });

    // then
    const newRule1 = elementRegistry.get('rule1');

    expect(pasted).to.be.true;

    expectOrder(root.rows, [
      rule2,
      rule3,
      rule4,
      newRule1
    ]);
  }));


  it('selectCellAbove', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry3');

    // when
    editorActions.trigger('selectCellAbove');

    // then
    var currentSelection = selection.get();

    expect(currentSelection.id).to.equal('inputEntry1');
  }));


  it('selectCellAbove - none available', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry1');

    // when
    editorActions.trigger('selectCellAbove');

    // then
    var currentSelection = selection.get();

    expect(currentSelection.id).to.equal('inputEntry1');
  }));


  it('selectCellBelow', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry1');

    // when
    editorActions.trigger('selectCellBelow');

    // then
    var currentSelection = selection.get();

    expect(currentSelection.id).to.equal('inputEntry3');
  }));


  it('selectCellBelow - none available', inject(function(editorActions, selection) {

    // given
    selection.select('inputEntry7');

    // when
    editorActions.trigger('selectCellBelow');

    // then
    var currentSelection = selection.get();

    expect(currentSelection.id).to.equal('inputEntry7');
  }));

});


// helpers //////////////////////

function expectOrder(actual, expected) {
  expected.forEach((e, index) => {
    expect(e).to.equal(actual[index]);
  });
}