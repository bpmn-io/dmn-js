import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import { triggerInputEvent } from 'dmn-js-shared/test/util/EventUtil';

import { queryEditor } from 'dmn-js-shared/test/util/EditorUtil';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';
import languageExpressionXML from '../../expression-language.dmn';

import CoreModule from 'lib/core';
import ModelingModule from 'lib/features/modeling';
import RulesModule from 'lib/features/rules';
import RulesEditorModule from 'lib/features/rules/editor';

describe('rules editor', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('editing', function() {

    beforeEach(bootstrapModeler(simpleXML, {
      modules: [
        CoreModule,
        ModelingModule,
        RulesModule,
        RulesEditorModule
      ],
      debounceInput: false
    }));


    it('should edit cell', inject(function(elementRegistry) {

      // given
      const editor = queryEditor('[data-element-id="inputEntry1"]', testContainer);

      editor.focus();

      // when
      triggerInputEvent(editor, 'foo');

      // then
      expect(elementRegistry.get('inputEntry1').businessObject.text).to.equal('foo');
    }));


    it('should edit cell - line breaks', inject(function(elementRegistry) {

      // given
      const editor = queryEditor('[data-element-id="inputEntry1"]', testContainer);

      editor.focus();

      // when
      triggerInputEvent(editor, 'foo\nbar');

      editor.blur();

      // then
      expect(elementRegistry.get('inputEntry1').businessObject.text).to.equal('foo\nbar');

      expect(editor.innerHTML).to.equal('foo\nbar');
    }));

  });


  describe('expression language', function() {

    describe('no configured default expression language', function() {

      beforeEach(bootstrapModeler(languageExpressionXML, {
        modules: [
          CoreModule,
          ModelingModule,
          RulesModule,
          RulesEditorModule
        ]
      }));


      describe('input', function() {

        it('should not display expression language if set to default', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry2"]', testContainer);

          // then
          expect(domQuery('.cell-expression-language', cell)).to.not.exist;
        });


        it('should display expression language if set to other than default',
          function() {

            // given
            const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

            // then
            expect(domQuery('.cell-expression-language', cell)).to.exist;
          });


        it('should not display expression language if focussed', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

          const editor = queryEditor('[data-element-id="inputEntry1"]', testContainer);

          // when
          editor.focus();

          // then
          expect(domQuery('.cell-expression-language', cell)).to.not.exist;
        });

      });


      describe('output', function() {

        it('should not display expression language if set to default', function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry2"]', testContainer);

          // then
          expect(domQuery('.cell-expression-language', cell)).to.not.exist;
        });


        it('should display expression language if set to other than default',
          function() {

            // given
            const cell = domQuery('[data-element-id="outputEntry1"]', testContainer);

            // then
            expect(domQuery('.cell-expression-language', cell)).to.exist;
          });


        it('should not display expression language if focussed', function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry1"]', testContainer);

          const editor = queryEditor('[data-element-id="outputEntry1"]', testContainer);

          // when
          editor.focus();

          // then
          expect(domQuery('.cell-expression-language', cell)).to.not.exist;
        });

      });

    });


    describe('configured default expression language', function() {

      beforeEach(bootstrapModeler(languageExpressionXML, {
        modules: [
          CoreModule,
          ModelingModule,
          RulesModule,
          RulesEditorModule
        ],
        defaultInputExpressionLanguage: 'javascript',
        defaultOutputExpressionLanguage: 'javascript'
      }));


      describe('input', function() {

        it('should not display expression language if set to default', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

          // then
          expect(domQuery('.cell-expression-language', cell)).to.not.exist;
        });


        it('should display expression language if set to other than default',
          function() {

            // given
            const cell = domQuery('[data-element-id="inputEntry2"]', testContainer);

            // then
            expect(domQuery('.cell-expression-language', cell)).to.exist;
          });


        it('should not display expression language if focussed', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry2"]', testContainer);

          const editor = queryEditor('[data-element-id="inputEntry2"]', testContainer);

          // when
          editor.focus();

          // then
          expect(domQuery('.cell-expression-language', cell)).to.not.exist;
        });

      });


      describe('output', function() {

        it('should not display expression language if set to default', function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry1"]', testContainer);

          // then
          expect(domQuery('.cell-expression-language', cell)).to.not.exist;
        });


        it('should display expression language if set to other than default',
          function() {

            // given
            const cell = domQuery('[data-element-id="outputEntry2"]', testContainer);

            // then
            expect(domQuery('.cell-expression-language', cell)).to.exist;
          });


        it('should not display expression language if focussed', function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry2"]', testContainer);

          const editor = queryEditor('[data-element-id="outputEntry2"]', testContainer);

          // when
          editor.focus();

          // then
          expect(domQuery('.cell-expression-language', cell)).to.not.exist;
        });

      });

    });

  });

});