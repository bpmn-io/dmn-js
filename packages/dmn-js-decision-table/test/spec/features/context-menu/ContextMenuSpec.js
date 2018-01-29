// eslint-disable-next-line
import Inferno from 'inferno';

import { bootstrapModeler, inject } from 'test/helper';

import { triggerMouseEvent } from 'dmn-js-shared/test/util/EventUtil';

import { classes as domClasses, query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';
import oneRuleOneInputOneOutputXML from '../../one-rule-one-input-one-output.dmn';

import ContextMenuModule from 'lib/features/context-menu';
import CoreModule from 'lib/core';
import DecisionTableHeadModule from 'lib/features/decision-table-head';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import RulesModule from 'lib/features/rules';


describe('context menu', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      ContextMenuModule,
      CoreModule,
      DecisionTableHeadModule,
      InteractionEventsModule,
      RulesModule
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
          triggerMouseEvent(anotherCell, 'click');

          // then
          expect(domQuery('.context-menu', testContainer)).not.to.exist;
        }, 0);
      });


      it('should contain correct entries', function() {

        // given
        const contextMenu = domQuery('.context-menu', testContainer),
              ruleEntriesGroup = domQuery('.context-menu-group-rule', contextMenu);

        // then
        expect(domQuery.all(
          '.context-menu-group-entry',
          ruleEntriesGroup
        )).to.have.lengthOf(6);

        expectEntries([
          '.context-menu-entry-add-rule-above',
          '.context-menu-entry-add-rule-below',
          '.context-menu-entry-remove-rule',
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


      describe('disabled entries when only one rule', function() {

        // import decision table with only one rule
        beforeEach(bootstrapModeler(oneRuleOneInputOneOutputXML, {
          modules: [
            ContextMenuModule,
            CoreModule,
            DecisionTableHeadModule,
            InteractionEventsModule,
            RulesModule
          ]
        }));

        beforeEach(function() {
          const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

          triggerMouseEvent(cell, 'contextmenu');
        });


        it('should contain disabled cut entry', function() {

          // given
          const contextMenu = domQuery('.context-menu', testContainer),
                ruleEntriesGroup = domQuery('.context-menu-group-rule', contextMenu);

          // then
          expect(
            domClasses(
              domQuery('.context-menu-entry-cut-rule', ruleEntriesGroup)
            ).has('disabled')
          ).to.be.true;
        });

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
          triggerMouseEvent(addRuleAboveEntry, 'click');

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
          triggerMouseEvent(addRuleBelowEntry, 'click');

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
          triggerMouseEvent(removeRuleEntry, 'click');

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


        it('should cut rule', inject(function(clipBoard, sheet) {

          // given
          const cutRuleEntry = domQuery('.context-menu-entry-cut-rule', testContainer);

          // when
          triggerMouseEvent(cutRuleEntry, 'click');

          // then
          const root = sheet.getRoot(),
                { rows } = root;

          expect(rows).to.have.lengthOf(3);

          expectOrder(rows, [
            rule2,
            rule3,
            rule4
          ]);

          expect(clipBoard.getElement()).to.equal(rule1);
        }));


        describe('paste', function() {

          beforeEach(function() {
            const cutRuleEntry = domQuery('.context-menu-entry-cut-rule', testContainer),
                  cell = domQuery('[data-element-id="inputEntry3"]', testContainer);

            triggerMouseEvent(cutRuleEntry, 'click');

            // open context menu again
            triggerMouseEvent(cell, 'contextmenu');
          });


          it('should paste rule above', inject(function(sheet) {

            // given
            const pasteRuleAboveEntry = domQuery(
              '.context-menu-entry-paste-rule-above',
              testContainer
            );

            // when
            triggerMouseEvent(pasteRuleAboveEntry, 'click');

            // then
            const root = sheet.getRoot(),
                  { rows } = root;

            expect(rows).to.have.lengthOf(4);

            expectOrder(rows, [
              rule1,
              rule2,
              rule3,
              rule4
            ]);
          }));


          it ('should paste rule below', inject(function(sheet) {

            // given
            const pasteRuleBelowEntry = domQuery(
              '.context-menu-entry-paste-rule-below',
              testContainer
            );

            // when
            triggerMouseEvent(pasteRuleBelowEntry, 'click');

            // then
            const root = sheet.getRoot(),
                  { rows } = root;

            expect(rows).to.have.lengthOf(4);

            expect(rows[0]).to.equal(rule2);
            expect(rows[1]).to.equal(rule1);
            expect(rows[2]).to.equal(rule3);
            expect(rows[3]).to.equal(rule4);
          }));

        });

      });

    });

  });


  describe('input', function() {

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
          triggerMouseEvent(anotherCell, 'click');

          // then
          expect(domQuery('.context-menu', testContainer)).not.to.exist;
        }, 0);
      });


      it('should contain correct entries', function() {

        // given
        const contextMenu = domQuery('.context-menu', testContainer),
              inputEntriesGroup = domQuery('.context-menu-group-input', contextMenu);

        // then
        expect(
          domQuery.all('.context-menu-group-entry', inputEntriesGroup)
        ).to.have.lengthOf(6);

        expectEntries([
          '.context-menu-entry-add-input-left',
          '.context-menu-entry-add-input-right',
          '.context-menu-entry-remove-input',
          '.context-menu-entry-cut-input',
          '.context-menu-entry-paste-input-left',
          '.context-menu-entry-paste-input-right',
        ], inputEntriesGroup);
      });


      it('should contain disabled paste entries', function() {

        // given
        const contextMenu = domQuery('.context-menu', testContainer),
              inputEntriesGroup = domQuery('.context-menu-group-input', contextMenu);

        // then
        expect(domClasses(
          domQuery('.context-menu-entry-paste-input-left', inputEntriesGroup)
        ).has('disabled')).to.be.true;

        expect(domClasses(
          domQuery('.context-menu-entry-paste-input-right', inputEntriesGroup)
        ).has('disabled')).to.be.true;
      });


      describe('disabled entries when only one input', function() {

        // import decision table with only one input
        beforeEach(bootstrapModeler(oneRuleOneInputOneOutputXML, {
          modules: [
            ContextMenuModule,
            CoreModule,
            DecisionTableHeadModule,
            InteractionEventsModule,
            RulesModule
          ]
        }));

        beforeEach(function() {
          const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

          triggerMouseEvent(cell, 'contextmenu');
        });


        it('should contain disabled cut entry', function() {

          // given
          const contextMenu = domQuery('.context-menu', testContainer),
                inputEntriesGroup = domQuery('.context-menu-group-input', contextMenu);

          // then
          expect(
            domClasses(
              domQuery('.context-menu-entry-cut-input', inputEntriesGroup)
            ).has('disabled')
          ).to.be.true;
        });

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
          triggerMouseEvent(addInputLeftEntry, 'click');

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
          triggerMouseEvent(addInputRight, 'click');

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
          triggerMouseEvent(removeInputEntry, 'click');

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


        it('should cut input', inject(function(clipBoard, sheet) {

          // given
          const cutInputEntry = domQuery('.context-menu-entry-cut-input', testContainer);

          // when
          triggerMouseEvent(cutInputEntry, 'click');

          // then
          const root = sheet.getRoot(),
                { cols } = root;

          expect(cols).to.have.lengthOf(3);

          expectOrder(cols, [
            input2,
            output1,
            output2
          ]);

          expect(clipBoard.getElement()).to.equal(input1);
        }));


        describe('paste', function() {

          beforeEach(function() {
            const cutInputEntry = domQuery(
                    '.context-menu-entry-cut-input',
                    testContainer
                  ),
                  cell = domQuery(
                    '[data-element-id="inputEntry2"]',
                    testContainer
                  );

            triggerMouseEvent(cutInputEntry, 'click');

            // open context menu again
            triggerMouseEvent(cell, 'contextmenu');
          });


          it('should paste input left', inject(function(sheet) {

            // given
            const pasteInputLeftEntry = domQuery(
              '.context-menu-entry-paste-input-left',
              testContainer
            );

            // when
            triggerMouseEvent(pasteInputLeftEntry, 'click');

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
          }));


          it ('should paste input right', inject(function(sheet) {

            // given
            const pasteInputRightEntry = domQuery(
              '.context-menu-entry-paste-input-right',
              testContainer
            );

            // when
            triggerMouseEvent(pasteInputRightEntry, 'click');

            // then
            const root = sheet.getRoot(),
                  { cols } = root;

            expect(cols).to.have.lengthOf(4);

            expectOrder(cols, [
              input2,
              input1,
              output1,
              output2
            ]);
          }));

        });

      });

    });

  });


  describe('output', function() {

    it('should open on right click', function() {

      // given
      const cell = domQuery('[data-element-id="outputEntry1"]', testContainer);

      // when
      triggerMouseEvent(cell, 'contextmenu');

      // then
      expect(domQuery('.context-menu', testContainer)).to.exist;
    });


    describe('entries', function() {

      let cell, anotherCell;

      beforeEach(function() {
        cell = domQuery('[data-element-id="outputEntry1"]', testContainer);
        anotherCell = domQuery('[data-element-id="inputEntry2"]', testContainer);

        triggerMouseEvent(cell, 'contextmenu');
      });


      it('should close on click elsewhere', function() {

        // TODO(philippfromme): make this work without timeout
        setTimeout(() => {

          // when
          triggerMouseEvent(anotherCell, 'click');

          // then
          expect(domQuery('.context-menu', testContainer)).not.to.exist;
        }, 0);
      });


      it('should contain correct entries', function() {

        // given
        const contextMenu = domQuery('.context-menu', testContainer),
              outputEntriesGroup = domQuery('.context-menu-group-output', contextMenu);

        // then
        expect(
          domQuery.all('.context-menu-group-entry', outputEntriesGroup)
        ).to.have.lengthOf(6);

        expectEntries([
          '.context-menu-entry-add-output-left',
          '.context-menu-entry-add-output-right',
          '.context-menu-entry-remove-output',
          '.context-menu-entry-cut-output',
          '.context-menu-entry-paste-output-left',
          '.context-menu-entry-paste-output-right',
        ], outputEntriesGroup);
      });


      it('should contain disabled paste entries', function() {

        // given
        const contextMenu = domQuery('.context-menu', testContainer),
              outputEntriesGroup = domQuery('.context-menu-group-output', contextMenu);

        // then
        expect(domClasses(
          domQuery('.context-menu-entry-paste-output-left', outputEntriesGroup)
        ).has('disabled')).to.be.true;

        expect(domClasses(
          domQuery('.context-menu-entry-paste-output-right', outputEntriesGroup)
        ).has('disabled')).to.be.true;
      });


      describe('disabled entries when only one output', function() {

        // import decision table with only one output
        beforeEach(bootstrapModeler(oneRuleOneInputOneOutputXML, {
          modules: [
            ContextMenuModule,
            CoreModule,
            DecisionTableHeadModule,
            InteractionEventsModule,
            RulesModule
          ]
        }));

        beforeEach(function() {
          const cell = domQuery('[data-element-id="outputEntry1"]', testContainer);

          triggerMouseEvent(cell, 'contextmenu');
        });


        it('should contain disabled cut entry', function() {

          // given
          const contextMenu = domQuery('.context-menu', testContainer),
                outputEntriesGroup = domQuery('.context-menu-group-output', contextMenu);

          // then
          expect(
            domClasses(
              domQuery('.context-menu-entry-cut-output', outputEntriesGroup)
            ).has('disabled')
          ).to.be.true;
        });

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
          triggerMouseEvent(addOutputLeftEntry, 'click');

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
          triggerMouseEvent(addOutputRight, 'click');

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
          triggerMouseEvent(removeOutputEntry, 'click');

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


        it('should cut output', inject(function(clipBoard, sheet) {

          // given
          const cutOutputEntry = domQuery(
            '.context-menu-entry-cut-output',
            testContainer
          );

          // when
          triggerMouseEvent(cutOutputEntry, 'click');

          // then
          const root = sheet.getRoot(),
                { cols } = root;

          expect(cols).to.have.lengthOf(3);

          expectOrder(cols, [
            input1,
            input2,
            output2
          ]);

          expect(clipBoard.getElement()).to.equal(output1);
        }));


        describe('paste', function() {

          beforeEach(function() {
            const cutOutputEntry = domQuery(
                    '.context-menu-entry-cut-output',
                    testContainer
                  ),
                  cell = domQuery(
                    '[data-element-id="outputEntry2"]',
                    testContainer
                  );

            triggerMouseEvent(cutOutputEntry, 'click');

            // open context menu again
            triggerMouseEvent(cell, 'contextmenu');
          });


          it('should paste output left', inject(function(sheet) {

            // given
            const pasteOutputLeftEntry = domQuery(
              '.context-menu-entry-paste-output-left',
              testContainer
            );

            // when
            triggerMouseEvent(pasteOutputLeftEntry, 'click');

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
          }));


          it ('should paste output right', inject(function(sheet) {

            // given
            const pasteOutputRightEntry = domQuery(
              '.context-menu-entry-paste-output-right',
              testContainer
            );

            // when
            triggerMouseEvent(pasteOutputRightEntry, 'click');

            // then
            const root = sheet.getRoot(),
                  { cols } = root;

            expect(cols).to.have.lengthOf(4);

            expectOrder(cols, [
              input1,
              input2,
              output2,
              output1
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
        .onGetComponent('context-menu-additional', () => <div class="foo">FOO</div>);

      // when
      const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

      triggerMouseEvent(cell, 'contextmenu');

      // then
      expect(domQuery('.foo', testContainer)).to.exist;
    }));

  });

});


////////// helpers //////////

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