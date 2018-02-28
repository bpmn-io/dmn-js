import { bootstrapModeler, inject } from 'test/helper';

import tableXML from './rules.dmn';

import CoreModule from 'lib/core';
import ModelingModule from 'lib/features/modeling';
import RulesModule from 'lib/features/rules';


describe('modeling rules', function() {

  beforeEach(bootstrapModeler(tableXML, {
    modules: [
      CoreModule,
      ModelingModule,
      RulesModule
    ]
  }));


  describe('remove', function() {

    it('should allow removing row', inject(function(rules) {

      // when
      const allowed = rules.allowed('row.remove');

      // then
      expect(allowed).to.be.true;
    }));


    it('should allow removing col', inject(function(elementRegistry, rules) {

      // given
      const input1 = elementRegistry.get('input1');

      // when
      const allowed = rules.allowed('col.remove', {
        col: input1
      });

      // then
      expect(allowed).to.be.true;
    }));


    it('should NOT allow removing last dmn:Input col', inject(
      function(elementRegistry, modeling, rules) {

        // given
        const input1 = elementRegistry.get('input1'),
              input2 = elementRegistry.get('input2');

        modeling.removeCol(input2);

        // when
        const allowed = rules.allowed('col.remove', {
          col: input1
        });

        // then
        expect(allowed).to.be.false;
      }
    ));


    it('should NOT allow removing last dmn:Output col', inject(
      function(elementRegistry, modeling, rules) {

        // given
        const output1 = elementRegistry.get('output1'),
              output2 = elementRegistry.get('output2');

        modeling.removeCol(output2);

        // when
        const allowed = rules.allowed('col.remove', {
          col: output1
        });

        // then
        expect(allowed).to.be.false;
      }
    ));

  });


  describe('paste', function() {

    it('should allow pasting row', inject(function(elementRegistry, rules) {

      // given
      const rule1 = elementRegistry.get('rule1'),
            rule2 = elementRegistry.get('rule2');

      // when
      const allowed = rules.allowed('paste', {
        elements: rule1,
        target: rule2
      });

      // then
      expect(allowed).to.be.true;
    }));


    it('should NOT allow pasting row', inject(
      function(elementRegistry, modeling, rules) {

        // given
        const rule1 = elementRegistry.get('rule1'),
              rule2 = elementRegistry.get('rule2');

        modeling.removeRow(rule1);

        modeling.addCol({ type: 'dmn:InputClause' }, 0);

        // when
        const allowed = rules.allowed('paste', {
          elements: rule1,
          target: rule2
        });

        // then
        expect(allowed).to.be.false;
      }
    ));


    it('should allow pasting col', inject(function(elementRegistry, rules) {

      // given
      const input1 = elementRegistry.get('input1'),
            input2 = elementRegistry.get('input2');

      // when
      const allowed = rules.allowed('paste', {
        elements: input1,
        target: input2
      });

      // then
      expect(allowed).to.be.true;
    }));


    it('should NOT allow pasting col', inject(
      function(elementRegistry, modeling, rules) {

        // given
        const input1 = elementRegistry.get('input1'),
              input2 = elementRegistry.get('input2');

        modeling.removeCol(input1);

        modeling.addRow({ type: 'dmn:DecisionRule' });

        // when
        const allowed = rules.allowed('paste', {
          elements: input1,
          target: input2
        });

        // then
        expect(allowed).to.be.false;
      }
    ));

  });

});