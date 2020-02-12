import { bootstrapModeler, inject } from 'test/helper';

import { query as domQuery } from 'min-dom';

import { triggerInputEvent } from 'dmn-js-shared/test/util/EventUtil';

import { queryEditor } from 'dmn-js-shared/test/util/EditorUtil';

import TestContainer from 'mocha-test-container-support';

import simpleXML from '../../simple.dmn';
import emptyRuleXML from './empty-rule.dmn';
import languageExpressionXML from '../../expression-language.dmn';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';
import DecisionRulesModule from 'src/features/decision-rules';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';


describe('features/decision-rules', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('editing', function() {

    beforeEach(bootstrapModeler(simpleXML, {
      modules: [
        CoreModule,
        ModelingModule,
        DecisionRulesModule,
        DecisionRulesEditorModule
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
      triggerInputEvent(editor, 'foo<br>bar<br>');

      editor.blur();

      // then
      expect(elementRegistry.get('inputEntry1').businessObject.text).to.equal('foo\nbar');

      expect(editor.innerHTML).to.equal('foo<br>bar<br>');
    }));

  });


  describe('expression language', function() {

    describe('no default expression language', function() {

      beforeEach(bootstrapModeler(languageExpressionXML, {
        modules: [
          CoreModule,
          ModelingModule,
          DecisionRulesModule,
          DecisionRulesEditorModule
        ]
      }));


      describe('on input', function() {

        it('should not display default', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry2"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.not.exist;
        });


        it('should display non-default default', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.exist;
        });


        it('should not display if focussed', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

          const editor = queryEditor('[data-element-id="inputEntry1"]', testContainer);

          // when
          editor.focus();

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.not.exist;
        });

      });


      describe('on output', function() {

        it('should not display default', function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry2"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.not.exist;
        });


        it('should display non-default',function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry1"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.exist;
        });


        it('should not display if focussed', function() {


          // given
          const cell = domQuery('[data-element-id="outputEntry1"]', testContainer);

          const editor = queryEditor('[data-element-id="outputEntry1"]', testContainer);

          // when
          editor.focus();

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.not.exist;
        });

      });

    });


    describe('configured default expression language', function() {

      beforeEach(bootstrapModeler(languageExpressionXML, {
        modules: [
          CoreModule,
          ModelingModule,
          DecisionRulesModule,
          DecisionRulesEditorModule
        ],
        defaultInputExpressionLanguage: 'javascript',
        defaultOutputExpressionLanguage: 'javascript'
      }));


      describe('on input', function() {

        it('should not display default', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry2"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.not.exist;
        });


        it('should display non-default', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.exist;
        });


        it('should not display if focussed', function() {

          // given
          const cell = domQuery('[data-element-id="inputEntry1"]', testContainer);

          const editor = queryEditor('[data-element-id="inputEntry1"]', testContainer);

          // when
          editor.focus();

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.not.exist;
        });

      });


      describe('on output', function() {

        it('should not display default', function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry1"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.not.exist;
        });


        it('should display non-default',function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry2"]', testContainer);

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.exist;
        });


        it('should not display expression language if focussed', function() {

          // given
          const cell = domQuery('[data-element-id="outputEntry2"]', testContainer);

          const editor = queryEditor('[data-element-id="outputEntry2"]', testContainer);

          // when
          editor.focus();

          // then
          expect(domQuery('.dmn-expression-language', cell)).to.not.exist;
        });

      });

    });

  });


  describe('placeholder', function() {

    beforeEach(bootstrapModeler(emptyRuleXML, {
      modules: [
        CoreModule,
        ModelingModule,
        DecisionRulesModule,
        DecisionRulesEditorModule
      ],
      debounceInput: false
    }));


    it('should show <-> input placeholder', inject(function() {

      // when
      const editor = queryEditor('[data-element-id="unaryTest_1"]', testContainer);

      // then
      expect(editor.textContent).to.eql('-');
    }));


    it('should NOT show <-> output placeholder', inject(function() {

      // when
      const editor = queryEditor('[data-element-id="outputEntry_1"]', testContainer);

      // then
      expect(editor.textContent).to.eql('');
    }));

  });

});
