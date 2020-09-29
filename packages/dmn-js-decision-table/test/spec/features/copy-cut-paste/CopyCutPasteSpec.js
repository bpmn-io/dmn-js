import { bootstrapModeler, inject } from 'test/helper';

import TestDiagram from './copy-cut-paste.dmn';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';
import CopyCutPasteModule from 'src/features/copy-cut-paste';


describe('features/copy-cut-paste', function() {

  beforeEach(bootstrapModeler(TestDiagram, {
    modules: [
      CoreModule,
      ModelingModule,
      CopyCutPasteModule
    ]
  }));


  describe('cut', function() {

    it('should cut rule', inject(
      function(clipboard, copyCutPaste, elementRegistry, sheet) {

        // given
        const { rows } = sheet.getRoot();

        const rule1 = elementRegistry.get('rule1');

        // when
        copyCutPaste.cut(rule1);

        // then
        expect(rows).to.have.length(3);

        const { elements } = clipboard.get();

        expect(elements.root).to.have.length(1);

        const rowDesc = elements.root[0];

        expect(rowDesc.cells).to.have.length(4);
      }
    ));


    it('should cut input', inject(
      function(clipboard, copyCutPaste, elementRegistry, sheet) {

        // given
        const { cols } = sheet.getRoot();

        const input1 = elementRegistry.get('input1');

        // when
        copyCutPaste.cut(input1);

        // then
        expect(cols).to.have.length(3);

        const { elements } = clipboard.get();

        const colDesc = elements.root[0];

        expect(colDesc.cells).to.have.length(4);
      }
    ));


    it('should cut output', inject(
      function(clipboard, copyCutPaste, elementRegistry, sheet) {

        // given
        const { cols } = sheet.getRoot();

        const output1 = elementRegistry.get('output1');

        // when
        copyCutPaste.cut(output1);

        // then
        expect(cols).to.have.length(3);

        const { elements } = clipboard.get();

        const colDesc = elements.root[0];

        expect(colDesc.cells).to.have.length(4);
      }
    ));

  });


  describe('copy', function() {

    it('should copy rule', inject(
      function(clipboard, copyCutPaste, elementRegistry, sheet) {

        // given
        const { rows } = sheet.getRoot();

        const rule1 = elementRegistry.get('rule1');

        // when
        copyCutPaste.copy(rule1);

        // then
        expect(rows).to.have.length(4);

        const { elements } = clipboard.get();

        expect(elements.root).to.have.length(1);

        const rowDesc = elements.root[0];

        expect(rowDesc.cells).to.have.length(4);
      }
    ));


    it('should copy input', inject(
      function(clipboard, copyCutPaste, elementRegistry, sheet) {

        // given
        const { cols } = sheet.getRoot();

        const input1 = elementRegistry.get('input1');

        // when
        copyCutPaste.copy(input1);

        // then
        expect(cols).to.have.length(4);

        const { elements } = clipboard.get();

        const colDesc = elements.root[0];

        expect(colDesc.cells).to.have.length(4);
      }
    ));


    it('should copy output', inject(
      function(clipboard, copyCutPaste, elementRegistry, sheet) {

        // given
        const { cols } = sheet.getRoot();

        const output1 = elementRegistry.get('output1');

        // when
        copyCutPaste.copy(output1);

        // then
        expect(cols).to.have.length(4);

        const { elements } = clipboard.get();

        const colDesc = elements.root[0];

        expect(colDesc.cells).to.have.length(4);
      }
    ));

  });


  describe('copy and paste', function() {

    it('should paste rule', inject(
      function(copyCutPaste, elementRegistry, sheet) {

        // given
        const { rows } = sheet.getRoot();

        const rule1 = elementRegistry.get('rule1'),
              rule4 = elementRegistry.get('rule4');

        copyCutPaste.copy(rule1);

        // when (paste 1st time)
        const pasted = copyCutPaste.pasteAfter(rule4);

        // then
        expect(rows).to.have.length(5);

        const newRule = rows[rows.length - 1];

        expect(pasted).to.be.true;
        expect(newRule).to.exist;

        const newRuleBo = newRule.businessObject;

        expect(newRuleBo.id).to.not.equal('rule1');
        expect(newRuleBo.inputEntry[0].id).to.not.equal('inputEntry1');
        expect(newRuleBo.inputEntry[1].id).to.not.equal('inputEntry2');
        expect(newRuleBo.outputEntry[0].id).to.not.equal('outputEntry1');
        expect(newRuleBo.outputEntry[1].id).to.not.equal('outputEntry1');

        // when (paste 2nd time)
        const pastedAgain = copyCutPaste.pasteAfter(newRule);

        // then
        expect(pastedAgain).to.be.undefined;
      }
    ));


    it('should paste input', inject(
      function(copyCutPaste, elementRegistry, sheet) {

        // given
        const { cols } = sheet.getRoot();

        const input1 = elementRegistry.get('input1'),
              input2 = elementRegistry.get('input2');

        copyCutPaste.copy(input1);

        // when (paste 1st time)
        const pasted = copyCutPaste.pasteAfter(input2);

        // then
        expect(cols).to.have.length(5);

        const newInput = cols[cols.indexOf(input2) + 1];

        expect(newInput).to.exist;
        expect(pasted).to.be.true;

        const newInputBo = newInput.businessObject;

        expect(newInputBo.id).to.not.equal('input1');
        expect(newInputBo.inputExpression.id).to.not.equal('inputExpression1');

        // when (paste 2nd time)
        const pastedAgain = copyCutPaste.pasteAfter(newInput);

        // then
        expect(pastedAgain).to.be.undefined;
      }
    ));


    it('should paste output', inject(
      function(copyCutPaste, elementRegistry, sheet) {

        // given
        const { cols } = sheet.getRoot();

        const output1 = elementRegistry.get('output1'),
              output2 = elementRegistry.get('output2');

        copyCutPaste.copy(output1);

        // when (paste 1st time)
        copyCutPaste.pasteAfter(output2);

        // then
        expect(cols).to.have.length(5);

        const newOutput = cols[cols.indexOf(output2) + 1];

        expect(newOutput).to.exist;

        expect(newOutput.businessObject.id).to.not.equal('output1');

        // when (paste 2nd time)
        const pastedAgain = copyCutPaste.pasteAfter(newOutput);

        // then
        expect(pastedAgain).to.be.undefined;
      }
    ));

  });


  describe('cut and paste', function() {

    it('should paste rule', inject(
      function(copyCutPaste, elementRegistry, sheet) {

        // given
        const { rows } = sheet.getRoot();

        const rule1 = elementRegistry.get('rule1'),
              rule4 = elementRegistry.get('rule4');

        copyCutPaste.cut(rule1);

        // when (paste 1st time)
        copyCutPaste.pasteAfter(rule4);

        // then
        expect(rows).to.have.length(4);

        const newRule1 = elementRegistry.get('rule1');

        expect(newRule1).to.exist;

        const newRule1Bo = newRule1.businessObject;

        expect(newRule1Bo.id).to.equal('rule1');
        expect(newRule1Bo.inputEntry[0].id).to.equal('inputEntry1');
        expect(newRule1Bo.inputEntry[1].id).to.equal('inputEntry2');
        expect(newRule1Bo.outputEntry[0].id).to.equal('outputEntry1');
        expect(newRule1Bo.outputEntry[1].id).to.equal('outputEntry2');

        // when (paste 2nd time)
        const pastedAgain = copyCutPaste.pasteAfter(newRule1);

        // then
        expect(pastedAgain).to.be.undefined;
      }
    ));


    it('should paste input', inject(
      function(copyCutPaste, elementRegistry, sheet) {

        // given
        const { cols } = sheet.getRoot();

        const input1 = elementRegistry.get('input1'),
              input2 = elementRegistry.get('input2');

        copyCutPaste.cut(input1);

        // when (paste 1st time)
        copyCutPaste.pasteAfter(input2);

        // then
        expect(cols).to.have.length(4);

        const newInput1 = elementRegistry.get('input1');

        expect(newInput1).to.exist;

        const newInput1Bo = newInput1.businessObject;

        expect(newInput1Bo.id).to.equal('input1');
        expect(newInput1Bo.inputExpression.id).to.equal('inputExpression1');

        // when (paste 2nd time)
        const pastedAgain = copyCutPaste.pasteAfter(newInput1);

        // then
        expect(pastedAgain).to.be.undefined;
      }
    ));


    it('should paste output', inject(
      function(copyCutPaste, elementRegistry, sheet) {

        // given
        const { cols } = sheet.getRoot();

        const output1 = elementRegistry.get('output1'),
              output2 = elementRegistry.get('output2');

        copyCutPaste.cut(output1);

        // when (paste 1st time)
        copyCutPaste.pasteAfter(output2);

        // then
        expect(cols).to.have.length(4);

        const newOutput1 = elementRegistry.get('output1');

        expect(newOutput1).to.exist;

        expect(newOutput1.businessObject.id).to.equal('output1');

        // when (paste 2nd time)
        const pastedAgain = copyCutPaste.pasteAfter(newOutput1);

        // then
        expect(pastedAgain).to.be.undefined;
      }
    ));

  });


  describe('paste', function() {

    it('should NOT paste rule as input', inject(
      function(copyCutPaste, sheet, elementRegistry) {

        // given
        const rule1 = elementRegistry.get('rule1');
        const input1 = elementRegistry.get('input1');

        copyCutPaste.copy(rule1);

        // when (paste 1st time)
        const pasted = copyCutPaste.pasteAfter(input1);

        // then
        expect(pasted).to.be.false;
      }
    ));


    it('should NOT paste input as rule', inject(
      function(copyCutPaste, sheet, elementRegistry) {

        // given
        const rule1 = elementRegistry.get('rule1');
        const input1 = elementRegistry.get('input1');

        copyCutPaste.copy(input1);

        // when (paste 1st time)
        const pasted = copyCutPaste.pasteAfter(rule1);

        // then
        expect(pasted).to.be.false;
      }
    ));


    it('should NOT paste empty clipboard', inject(
      function(copyCutPaste, elementRegistry) {

        // given
        const rule1 = elementRegistry.get('rule1');

        // when (paste 1st time)
        const pasted = copyCutPaste.pasteAfter(rule1);

        // then
        expect(pasted).to.be.undefined;
      }
    ));

  });

});
