require('../../../TestHelper');

/* global bootstrapModeler, inject */

import simpleXML from '../../simple.dmn';

import CoreModule from '../../../../lib/core';
import EditorActionsModule from '../../../../lib/features/editor-actions';
import RulesModule from '../../../../lib/features/rules';


describe('context menu', function() {

  let rule1, rule2, rule3, rule4;

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      EditorActionsModule,
      RulesModule
    ]
  }));

  beforeEach(inject(function(sheet) {
    const root = sheet.getRoot(),
          { rows } = root;

    rule1 = rows[0];
    rule2 = rows[1];
    rule3 = rows[2];
    rule4 = rows[3];
  }));


  it('addRule', inject(function(editorActions, sheet) {

    // when
    const rule = editorActions.trigger('addRule');

    // then
    const root = sheet.getRoot();

    expect(root.rows).to.have.lengthOf(5);

    expectOrder(root.rows, [
      rule1,
      rule2,
      rule3,
      rule4,
      rule
    ]);
  }));


  it('addRuleAbove', inject(function(editorActions, sheet) {

    // when
    const rule = editorActions.trigger('addRuleAbove', { rule: rule1 });
    
    // then
    const root = sheet.getRoot();

    expect(root.rows).to.have.lengthOf(5);

    expectOrder(root.rows, [
      rule,
      rule1,
      rule2,
      rule3
    ]);
  }));


  it('addRuleBelow', inject(function(editorActions, sheet) {

    // when
    const rule = editorActions.trigger('addRuleBelow', { rule: rule1 });
    
    // then
    const root = sheet.getRoot();

    expect(root.rows).to.have.lengthOf(5);

    expectOrder(root.rows, [
      rule1,
      rule,
      rule2,
      rule3,
      rule4
    ]);
  }));


  it('removeRow', inject(function(editorActions, sheet) {
    
    // when
    editorActions.trigger('removeRule', { rule: rule1 });
    
    // then
    const root = sheet.getRoot();

    expect(root.rows).to.have.lengthOf(3);

    expectOrder(root.rows, [
      rule2,
      rule3,
      rule4
    ]);
  }));

  // TODO(philippfromme): add missing tests
});

////////// helpers //////////

function expectOrder(actual, expected) {
  expected.forEach((e, index) => {
    expect(e).to.equal(actual[index]);
  });
}