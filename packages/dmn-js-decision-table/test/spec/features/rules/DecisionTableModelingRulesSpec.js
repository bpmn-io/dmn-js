import { bootstrapModeler, inject } from 'test/helper';

import tableXML from './rules.dmn';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';
import RulesModule from 'src/features/rules';


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

    const rowData = {
      root: [ {
        type: 'row',
        businessObject: {
          $type: 'dmn:DecisionRule'
        },
        cells: [ {
          type: 'cell',
          businessObject: {
            $type: 'dmn:UnaryTests'
          }
        }, {
          type: 'cell',
          businessObject: {
            $type: 'dmn:UnaryTests'
          }
        }, {
          type: 'cell',
          businessObject: {
            $type: 'dmn:LiteralExpression'
          }
        }, {
          type: 'cell',
          businessObject: {
            $type: 'dmn:LiteralExpression'
          }
        } ]
      } ]
    };

    const colData = {
      root: [ {
        type: 'col',
        businessObject: {
          $type: 'dmn:InputClause'
        },
        cells: [ {
          type: 'cell',
          businessObject: {
            $type: 'dmn:UnaryTests'
          }
        }, {
          type: 'cell',
          businessObject: {
            $type: 'dmn:UnaryTests'
          }
        }, {
          type: 'cell',
          businessObject: {
            $type: 'dmn:UnaryTests'
          }
        }, {
          type: 'cell',
          businessObject: {
            $type: 'dmn:UnaryTests'
          }
        } ]
      } ]
    };


    describe('paste row', function() {

      it('should allow', inject(function(elementRegistry, rules) {

        // given
        const rule1 = elementRegistry.get('rule1');

        // when
        const allowed = rules.allowed('paste', {
          data: rowData,
          target: rule1
        });

        // then
        expect(allowed).to.be.true;
      }));


      it('should NOT allow if cols changed', inject(
        function(elementRegistry, modeling, rules) {

          // given
          const rule1 = elementRegistry.get('rule1');

          modeling.removeRow(rule1);

          modeling.addCol({ type: 'dmn:InputClause' }, 0);

          // when
          const allowed = rules.allowed('paste', {
            data: rowData,
            target: rule1
          });

          // then
          expect(allowed).to.be.false;
        }
      ));


      it('should NOT allow paste as col', inject(
        function(elementRegistry, modeling, rules) {

          // given
          const input1 = elementRegistry.get('input1');

          // when
          const allowed = rules.allowed('paste', {
            data: rowData,
            target: input1
          });

          // then
          expect(allowed).to.be.false;
        }
      ));

    });


    describe('paste col', function() {

      it('should allow', inject(function(elementRegistry, rules) {

        // given
        const input1 = elementRegistry.get('input1');

        // when
        const allowed = rules.allowed('paste', {
          data: colData,
          target: input1
        });

        // then
        expect(allowed).to.be.true;
      }));


      it('should NOT allow if rows changed', inject(
        function(elementRegistry, modeling, rules) {

          // given
          const input1 = elementRegistry.get('input1');

          modeling.removeCol(input1);

          modeling.addRow({ type: 'dmn:DecisionRule' });

          // when
          const allowed = rules.allowed('paste', {
            data: colData,
            target: input1
          });

          // then
          expect(allowed).to.be.false;
        }
      ));


      it('should NOT allow paste as row', inject(
        function(elementRegistry, modeling, rules) {

          // given
          const rule1 = elementRegistry.get('rule1');

          // when
          const allowed = rules.allowed('paste', {
            data: colData,
            target: rule1
          });

          // then
          expect(allowed).to.be.false;
        }
      ));

    });

  });

});