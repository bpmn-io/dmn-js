// eslint-disable-next-line
import Inferno from 'inferno';

import { bootstrapModeler, inject } from 'test/helper';

import {
  triggerMouseEvent,
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import {
  classes as domClasses,
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';

import ContextMenuModule from 'src/features/context-menu';
import CoreModule from 'src/core';
import DecisionTableHeadModule from 'src/features/decision-table-head';
import DecisionTableHeadEditorModule from 'src/features/decision-table-head/editor';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'src/features/modeling';
import DecisionRulesModule from 'src/features/decision-rules';


describe('context menu', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      ContextMenuModule,
      CoreModule,
      DecisionTableHeadModule,
      DecisionTableHeadEditorModule,
      InteractionEventsModule,
      ModelingModule,
      DecisionRulesModule
    ]
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('rules', function() {

    it('should open on right click', function() {

      // given
      const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

      // when
      triggerMouseEvent(cell, 'contextmenu');

      // then
      expect(domQuery('.context-menu', testContainer)).to.exist;
    });


    describe('entries', function() {

      let cell, anotherCell;

      beforeEach(function() {
        cell = domQuery('[data-element-id="inputEntry1"]', testContainer);
        anotherCell = domQuery('[data-element-id="inputEntry2"]', testContainer);

        triggerMouseEvent(cell, 'contextmenu');
      });


      it('should close on click elsewhere', function() {

        // TODO(philippfromme): make this work without timeout
        setTimeout(() => {

          // when
          triggerClick(anotherCell);

          // then
          expect(domQuery('.context-menu', testContainer)).not.to.exist;
        }, 0);
      });


      it('should contain correct entries', function() {

        // given
        const contextMenu = domQuery('.context-menu', testContainer),
              ruleEntriesGroup = domQuery('.context-menu-group-rule', contextMenu);

        // then
        expect(domQueryAll(
          '.context-menu-group-entry',
          ruleEntriesGroup
        )).to.have.lengthOf(7);

        expectEntries([
          '.context-menu-entry-add-rule-above',
          '.context-menu-entry-add-rule-below',
          '.context-menu-entry-remove-rule',
          '.context-menu-entry-copy-rule',
          '.context-menu-entry-cut-rule',
          '.context-menu-entry-paste-rule-above',
          '.context-menu-entry-paste-rule-below',
        ], ruleEntriesGroup);
      });


      it('should contain disabled paste entries', function() {

        // given
        const contextMenu = domQuery('.context-menu', testContainer),
              ruleEntriesGroup = domQuery('.context-menu-group-rule', contextMenu);

        // then
        expect(domClasses(
          domQuery('.context-menu-entry-paste-rule-above', ruleEntriesGroup)
        ).has('disabled')).to.be.true;

        expect(domClasses(
          domQuery('.context-menu-entry-paste-rule-below', ruleEntriesGroup)
        ).has('disabled')).to.be.true;
      });


      describe('actions', function() {

        let rule1, rule2, rule3, rule4;

        beforeEach(inject(function(sheet) {
          const root = sheet.getRoot(),
                { rows } = root;

          rule1 = rows[0];
          rule2 = rows[1];
          rule3 = rows[2];
          rule4 = rows[3];
        }));


        it('should add rule above', inject(function(sheet) {

          // given
          const addRuleAboveEntry = domQuery(
            '.context-menu-entry-add-rule-above',
            testContainer
          );

          // when
          triggerClick(addRuleAboveEntry);

          // then
          const root = sheet.getRoot(),
                { rows } = root;

          expect(rows).to.have.lengthOf(5);

          expect(rows[1]).to.equal(rule1);
          expect(rows[2]).to.equal(rule2);
          expect(rows[3]).to.equal(rule3);
          expect(rows[4]).to.equal(rule4);
        }));


        it('should add rule below', inject(function(sheet) {

          // given
          const addRuleBelowEntry = domQuery(
            '.context-menu-entry-add-rule-below',
            testContainer
          );

          // when
          triggerClick(addRuleBelowEntry);

          // then
          const root = sheet.getRoot(),
                { rows } = root;

          expect(rows).to.have.lengthOf(5);

          expect(rows[0]).to.equal(rule1);
          expect(rows[2]).to.equal(rule2);
          expect(rows[3]).to.equal(rule3);
          expect(rows[4]).to.equal(rule4);
        }));


        it('should remove rule', inject(function(sheet) {

          // given
          const removeRuleEntry = domQuery(
            '.context-menu-entry-remove-rule',
            testContainer
          );

          // when
          triggerClick(removeRuleEntry);

          // then
          const root = sheet.getRoot(),
                { rows } = root;

          expect(rows).to.have.lengthOf(3);

          expectOrder(rows, [
            rule2,
            rule3,
            rule4
          ]);
        }));


        it('should copy rule', inject(function(clipboard, sheet) {

          // given
          const copyRule = domQuery('.context-menu-entry-copy-rule', testContainer);

          // when
          triggerClick(copyRule);

          // then
          const root = sheet.getRoot(),
                { rows } = root;

          expect(rows).to.have.lengthOf(4);

          expect(clipboard.isEmpty()).to.be.false;
        }));


        it('should cut rule', inject(function(clipboard, sheet) {

          // given
          const cutRuleEntry = domQuery('.context-menu-entry-cut-rule', testContainer);

          // when
          triggerClick(cutRuleEntry);

          // then
          const root = sheet.getRoot(),
                { rows } = root;

          expect(rows).to.have.lengthOf(3);

          expectOrder(rows, [
            rule2,
            rule3,
            rule4
          ]);

          expect(clipboard.isEmpty()).to.be.false;
        }));


        describe('paste', function() {

          beforeEach(function() {
            const cutRuleEntry = domQuery('.context-menu-entry-cut-rule', testContainer),
                  cell = domQuery('[data-element-id="inputEntry3"]', testContainer);

            triggerClick(cutRuleEntry);

            // open context menu again
            triggerMouseEvent(cell, 'contextmenu');
          });


          it('should paste rule above', inject(function(elementRegistry, sheet) {

            // given
            const pasteRuleAboveEntry = domQuery(
              '.context-menu-entry-paste-rule-above',
              testContainer
            );

            // when
            triggerClick(pasteRuleAboveEntry);

            // then
            const newRule1 = elementRegistry.get('rule1');

            const root = sheet.getRoot(),
                  { rows } = root;

            expect(rows).to.have.lengthOf(4);

            expectOrder(rows, [
              newRule1,
              rule2,
              rule3,
              rule4
            ]);
          }));


          it('should paste rule below', inject(function(elementRegistry, sheet) {

            // given
            const pasteRuleBelowEntry = domQuery(
              '.context-menu-entry-paste-rule-below',
              testContainer
            );

            // when
            triggerClick(pasteRuleBelowEntry);

            // then
            const newRule1 = elementRegistry.get('rule1');

            const root = sheet.getRoot(),
                  { rows } = root;

            expect(rows).to.have.lengthOf(4);

            expectOrder(rows, [
              rule2,
              newRule1,
              rule3,
              rule4
            ]);
          }));

        });

      });

    });

  });


  describe('input - col', function() {

    describe('should open on right click', function() {

      it('input', function() {

        // given
        const cell =
          domQuery('.input-cell.input-editor[data-col-id="input1"]', testContainer);

        // when
        triggerMouseEvent(cell, 'contextmenu');

        // then
        expect(domQuery('.context-menu', testContainer)).to.exist;
      });

    });


    describe('entries', function() {

      let cell, anotherCell;

      beforeEach(function() {
        cell = domQuery('[data-col-id="input1"]', testContainer);
        anotherCell = domQuery('[data-element-id="inputEntry2"]', testContainer);

        triggerMouseEvent(cell, 'contextmenu');
      });


      it('should NOT contain cell entries', inject(function(components) {

        // given
        components.onGetComponent('context-menu-cell-additional', () => {
          return <div>FOO</div>;
        });

        const contextMenu = domQuery('.context-menu', testContainer);

        // then
        expect(domQuery('.context-menu-group-cell', contextMenu)).to.not.exist;
      }));


      it('should close on click elsewhere', function() {

        // TODO(philippfromme): make this work without timeout
        setTimeout(() => {

          // when
          triggerClick(anotherCell);

          // then
          expect(domQuery('.context-menu', testContainer)).not.to.exist;
        }, 0);
      });


      it('should contain correct entries', function() {

        // given
        const contextMenu = domQuery('.context-menu', testContainer);

        // then
        expectEntries([
          '.context-menu-entry-add-input-left',
          '.context-menu-entry-add-input-right',
          '.context-menu-entry-remove-input',
          '.context-menu-entry-copy-input',
          '.context-menu-entry-cut-input',
          '.context-menu-entry-paste-input-left',
          '.context-menu-entry-paste-input-right',
        ], contextMenu);
      });


      it('should contain disabled paste entries', function() {

        // given
        const contextMenu = domQuery('.context-menu', testContainer);

        // then
        expect(domClasses(
          domQuery('.context-menu-entry-paste-input-left', contextMenu)
        ).has('disabled')).to.be.true;

        expect(domClasses(
          domQuery('.context-menu-entry-paste-input-right', contextMenu)
        ).has('disabled')).to.be.true;
      });


      describe('actions', function() {

        let input1, input2, output1, output2;

        beforeEach(inject(function(sheet) {
          const root = sheet.getRoot(),
                { cols } = root;

          input1 = cols[0];
          input2 = cols[1];
          output1 = cols[2];
          output2 = cols[3];
        }));


        it('should add input left', inject(function(sheet) {

          // given
          const addInputLeftEntry = domQuery(
            '.context-menu-entry-add-input-left',
            testContainer
          );

          // when
          triggerClick(addInputLeftEntry);

          // then
          const root = sheet.getRoot(),
                { cols } = root;

          expect(cols).to.have.lengthOf(5);

          expect(cols[1]).to.equal(input1);
          expect(cols[2]).to.equal(input2);
          expect(cols[3]).to.equal(output1);
          expect(cols[4]).to.equal(output2);
        }));


        it('should add input right', inject(function(sheet) {

          // given
          const addInputRight = domQuery(
            '.context-menu-entry-add-input-right',
            testContainer
          );

          // when
          triggerClick(addInputRight);

          // then
          const root = sheet.getRoot(),
                { cols } = root;

          expect(cols).to.have.lengthOf(5);

          expect(cols[0]).to.equal(input1);
          expect(cols[2]).to.equal(input2);
          expect(cols[3]).to.equal(output1);
          expect(cols[4]).to.equal(output2);
        }));


        it('should remove input', inject(function(sheet) {

          // given
          const removeInputEntry = domQuery(
            '.context-menu-entry-remove-input',
            testContainer
          );

          // when
          triggerClick(removeInputEntry);

          // then
          const root = sheet.getRoot(),
                { cols } = root;

          expect(cols).to.have.lengthOf(3);

          expectOrder(cols, [
            input2,
            output1,
            output2
          ]);
        }));


        it('should copy input', inject(function(clipboard, sheet) {

          // given
          const cutInputEntry = domQuery('.context-menu-entry-copy-input', testContainer);

          // when
          triggerClick(cutInputEntry);

          // then
          const root = sheet.getRoot(),
                { cols } = root;

          expect(cols).to.have.lengthOf(4);

          expectOrder(cols, [
            input1,
            input2,
            output1,
            output2
          ]);

          expect(clipboard.isEmpty()).to.be.false;
        }));


        it('should cut input', inject(function(clipboard, sheet) {

          // given
          const cutInputEntry = domQuery('.context-menu-entry-cut-input', testContainer);

          // when
          triggerClick(cutInputEntry);

          // then
          const root = sheet.getRoot(),
                { cols } = root;

          expect(cols).to.have.lengthOf(3);

          expectOrder(cols, [
            input2,
            output1,
            output2
          ]);

          expect(clipboard.isEmpty()).to.be.false;
        }));


        describe('paste', function() {

          beforeEach(function() {
            const cutInputEntry = domQuery(
                    '.context-menu-entry-cut-input',
                    testContainer
                  ),
                  cell = domQuery(
                    '[data-col-id="input2"]',
                    testContainer
                  );

            triggerClick(cutInputEntry);

            // open context menu again
            triggerMouseEvent(cell, 'contextmenu');
          });


          it('should paste input left', inject(function(elementRegistry, sheet) {

            // given
            const pasteInputLeftEntry = domQuery(
              '.context-menu-entry-paste-input-left',
              testContainer
            );

            // when
            triggerClick(pasteInputLeftEntry);

            // then
            const newInput1 = elementRegistry.get('input1');

            const root = sheet.getRoot(),
                  { cols } = root;

            expect(cols).to.have.lengthOf(4);

            expectOrder(cols, [
              newInput1,
              input2,
              output1,
              output2
            ]);
          }));


          it ('should paste input right', inject(function(elementRegistry, sheet) {

            // given
            const pasteInputRightEntry = domQuery(
              '.context-menu-entry-paste-input-right',
              testContainer
            );

            // when
            triggerClick(pasteInputRightEntry);

            // then
            const newInput1 = elementRegistry.get('input1');

            const root = sheet.getRoot(),
                  { cols } = root;

            expect(cols).to.have.lengthOf(4);

            expectOrder(cols, [
              input2,
              newInput1,
              output1,
              output2
            ]);
          }));

        });

      });

    });

  });


  describe('output - col', function() {

    describe('should open on right click', function() {

      it('output', function() {

        // given
        const cell =
          domQuery('.output-cell.output-editor[data-col-id="output1"]', testContainer);

        // when
        triggerMouseEvent(cell, 'contextmenu');

        // then
        expect(domQuery('.context-menu', testContainer)).to.exist;
      });

    });


    describe('entries', function() {

      let cell, anotherCell;

      beforeEach(function() {
        cell = domQuery('[data-col-id="output1"]', testContainer);
        anotherCell = domQuery('[data-element-id="inputEntry2"]', testContainer);

        triggerMouseEvent(cell, 'contextmenu');
      });


      it('should NOT contain cell entries', inject(function(components) {

        // given
        components.onGetComponent('context-menu-cell-additional', () => {
          return <div>FOO</div>;
        });

        const contextMenu = domQuery('.context-menu', testContainer);

        // then
        expect(domQuery('.context-menu-group-cell', contextMenu)).to.not.exist;
      }));


      it('should close on click elsewhere', function() {

        // TODO(philippfromme): make this work without timeout
        setTimeout(() => {

          // when
          triggerClick(anotherCell);

          // then
          expect(domQuery('.context-menu', testContainer)).not.to.exist;
        }, 0);
      });


      it('should contain correct entries', function() {

        // given
        const contextMenu = domQuery('.context-menu', testContainer);

        // then
        expectEntries([
          '.context-menu-entry-add-output-left',
          '.context-menu-entry-add-output-right',
          '.context-menu-entry-remove-output',
          '.context-menu-entry-copy-output',
          '.context-menu-entry-cut-output',
          '.context-menu-entry-paste-output-left',
          '.context-menu-entry-paste-output-right',
        ], contextMenu);
      });


      it('should contain disabled paste entries', function() {

        // given
        const contextMenu = domQuery('.context-menu', testContainer);

        // then
        expect(domClasses(
          domQuery('.context-menu-entry-paste-output-left', contextMenu)
        ).has('disabled')).to.be.true;

        expect(domClasses(
          domQuery('.context-menu-entry-paste-output-right', contextMenu)
        ).has('disabled')).to.be.true;
      });


      describe('actions', function() {

        let input1, input2, output1, output2;

        beforeEach(inject(function(sheet) {
          const root = sheet.getRoot(),
                { cols } = root;

          input1 = cols[0],
          input2 = cols[1],
          output1 = cols[2];
          output2 = cols[3];
        }));


        it('should add output left', inject(function(sheet) {

          // given
          const addOutputLeftEntry = domQuery(
            '.context-menu-entry-add-output-left',
            testContainer
          );

          // when
          triggerClick(addOutputLeftEntry);

          // then
          const root = sheet.getRoot(),
                { cols } = root;

          expect(cols).to.have.lengthOf(5);

          expect(cols[0]).to.equal(input1);
          expect(cols[1]).to.equal(input2);
          expect(cols[3]).to.equal(output1);
          expect(cols[4]).to.equal(output2);
        }));


        it('should add output right', inject(function(sheet) {

          // given
          const addOutputRight = domQuery(
            '.context-menu-entry-add-output-right',
            testContainer
          );

          // when
          triggerClick(addOutputRight);

          // then
          const root = sheet.getRoot(),
                { cols } = root;

          expect(cols).to.have.lengthOf(5);

          expect(cols[0]).to.equal(input1);
          expect(cols[1]).to.equal(input2);
          expect(cols[2]).to.equal(output1);
          expect(cols[4]).to.equal(output2);
        }));


        it('should remove output', inject(function(sheet) {

          // given
          const removeOutputEntry = domQuery(
            '.context-menu-entry-remove-output',
            testContainer
          );

          // when
          triggerClick(removeOutputEntry);

          // then
          const root = sheet.getRoot(),
                { cols } = root;

          expect(cols).to.have.lengthOf(3);

          expectOrder(cols, [
            input1,
            input2,
            output2
          ]);
        }));


        it('should copy output', inject(function(clipboard, sheet) {

          // given
          const cutOutputEntry = domQuery(
            '.context-menu-entry-copy-output',
            testContainer
          );

          // when
          triggerClick(cutOutputEntry);

          // then
          const root = sheet.getRoot(),
                { cols } = root;

          expect(cols).to.have.lengthOf(4);

          expectOrder(cols, [
            input1,
            input2,
            output1,
            output2
          ]);

          expect(clipboard.isEmpty()).to.be.false;
        }));


        it('should cut output', inject(function(clipboard, sheet) {

          // given
          const cutOutputEntry = domQuery(
            '.context-menu-entry-cut-output',
            testContainer
          );

          // when
          triggerClick(cutOutputEntry);

          // then
          const root = sheet.getRoot(),
                { cols } = root;

          expect(cols).to.have.lengthOf(3);

          expectOrder(cols, [
            input1,
            input2,
            output2
          ]);

          expect(clipboard.isEmpty()).to.be.false;
        }));


        describe('paste', function() {

          beforeEach(function() {
            const cutOutputEntry = domQuery(
                    '.context-menu-entry-cut-output',
                    testContainer
                  ),
                  cell = domQuery(
                    '[data-col-id="output2"]',
                    testContainer
                  );

            triggerClick(cutOutputEntry);

            // open context menu again
            triggerMouseEvent(cell, 'contextmenu');
          });


          it('should paste output left', inject(function(elementRegistry, sheet) {

            // given
            const pasteOutputLeftEntry = domQuery(
              '.context-menu-entry-paste-output-left',
              testContainer
            );

            // when
            triggerClick(pasteOutputLeftEntry);

            // then
            const newOutput1 = elementRegistry.get('output1');

            const root = sheet.getRoot(),
                  { cols } = root;

            expect(cols).to.have.lengthOf(4);

            expectOrder(cols, [
              input1,
              input2,
              newOutput1,
              output2
            ]);
          }));


          it ('should paste output right', inject(function(elementRegistry, sheet) {

            // given
            const pasteOutputRightEntry = domQuery(
              '.context-menu-entry-paste-output-right',
              testContainer
            );

            // when
            triggerClick(pasteOutputRightEntry);

            // then
            const newOutput1 = elementRegistry.get('output1');

            const root = sheet.getRoot(),
                  { cols } = root;

            expect(cols).to.have.lengthOf(4);

            expectOrder(cols, [
              input1,
              input2,
              output2,
              newOutput1
            ]);
          }));

        });

      });

    });

  });


  describe('additional entries', function() {

    it('should allow additional entries', inject(function(components) {

      // given
      components
        .onGetComponent('context-menu-cell-additional', () => <div class="foo">FOO</div>);

      // when
      const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

      triggerMouseEvent(cell, 'contextmenu');

      // then
      expect(domQuery('.foo', testContainer)).to.exist;
    }));

  });

});


// helpers //////////////////////

function expectEntries(entries, contextMenu) {
  entries.forEach(entry => {
    expect(domQuery(entry, contextMenu)).to.exist;
  });
}

function expectOrder(actual, expected) {
  expected.forEach((e, index) => {
    expect(e).to.equal(actual[index]);
  });
}