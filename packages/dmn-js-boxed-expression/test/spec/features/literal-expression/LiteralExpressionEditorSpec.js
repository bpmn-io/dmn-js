import * as sinon from 'sinon';
import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import { waitFor } from '@testing-library/dom';

import { query as domQuery } from 'min-dom';

import {
  act,
  bootstrapModeler,
  inject,
  skipFF
} from 'test/helper';

import {
  triggerInputEvent,
  triggerKeyEvent
} from 'dmn-js-shared/test/util/EventUtil';
import { queryEditor } from 'dmn-js-shared/test/util/EditorUtil';
import { translateModule } from 'dmn-js-shared/test/util/TranslateUtil';

import literalExpressionXML from '../../literal-expression.dmn';
import nonDefaultExpressionLanguageXML from '../../expression-language.dmn';

const JUEL_AND_FEEL = [
  { label: 'JUEL', value: 'juel' },
  { label: 'FEEL', value: 'feel' }
];


describe('features/literal-expression - editor', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });


  describe('editing', function() {

    const variableResolver = {
      getVariables: () => [
        { name: 'Variable', typeRef: 'string' }
      ],
      registerProvider() {}
    };

    beforeEach(bootstrapModeler(literalExpressionXML, {
      debounceInput: false,
      additionalModules: [
        translateModule,
        { variableResolver: [ 'value', variableResolver ] }
      ]
    }));

    afterEach(function() {
      sinon.restore();
    });


    it('should render', function() {

      // then
      expect(domQuery('.dmn-boxed-expression-body .textarea', testContainer)).to.exist;
    });


    it('should have accessible label', function() {

      // then
      expect(domQuery('.textarea [aria-label]', testContainer)).to.exist;
    });


    it('should translate accessible label', function() {

      // then
      expect(domQuery('.textarea [aria-label]', testContainer).getAttribute('aria-label'))
        .to.equal('tr(Literal expression)');
    });


    skipFF()('should edit literal expression text (FEEL)', inject(
      async function(viewer) {

        // given
        const editor = queryEditor('.textarea', testContainer);

        await act(() => editor.focus());

        const input = document.activeElement;

        await act(() => input.textContent = 'foo');

        // when
        await act(() => input.blur());

        // then
        expect(viewer.getRootElement().decisionLogic.text).to.equal('foo');
      }
    ));


    skipFF()('should NOT undo unrelated command on undo (FEEL)', inject(
      async function(commandStack, literalExpression, viewer) {

        // given
        const decisionLogic = viewer.getRootElement().decisionLogic;

        literalExpression.setText(decisionLogic, 'committed');

        const editor = queryEditor('.textarea', testContainer);

        await act(() => editor.focus());

        // when
        await act(() => {
          triggerKeyEvent(document.activeElement, 'keydown', {
            key: 'z',
            keyCode: 90,
            ctrlKey: true
          });
        });

        // then
        expect(decisionLogic.text).to.equal('committed');
        expect(commandStack.canRedo()).to.be.false;
      }
    ));


    it('should edit literal expression text (non-FEEL)', inject(
      function(literalExpression, viewer) {

        // given
        const decisionLogic = viewer.getRootElement().decisionLogic;

        literalExpression.setExpressionLanguage(decisionLogic, 'javascript');

        const editor = queryEditor('.textarea', testContainer);

        editor.focus();

        // when
        triggerInputEvent(editor, 'foo');

        // then
        expect(decisionLogic.text).to.equal('foo');
      }
    ));


    it('should pass variables to editor', inject(
      async function(literalExpression, viewer) {

        // given
        const getVariablesSpy = sinon.spy(variableResolver, 'getVariables');

        // when
        literalExpression.setText(viewer.getRootElement().decisionLogic, 'Var');

        // then
        await waitFor(() => {
          expect(getVariablesSpy).to.have.been.called;
        });
      }
    ));

  });


  describe('editor selection', function() {

    describe('default', function() {

      beforeEach(bootstrapModeler(literalExpressionXML));


      it('should use FEEL editor', function() {

        // then
        expect(domQuery('.textarea .cm-content', testContainer)).to.exist;
      });


      it('should use text editor after changing expression language', inject(
        function(literalExpression, viewer) {

          // when
          literalExpression.setExpressionLanguage(
            viewer.getRootElement().decisionLogic, 'javascript'
          );

          // then
          expect(domQuery('.textarea .cm-content', testContainer)).not.to.exist;
        }
      ));

    });


    describe('non-FEEL expression language', function() {

      beforeEach(bootstrapModeler(nonDefaultExpressionLanguageXML));


      it('should use text editor', function() {

        // then
        expect(domQuery('.textarea', testContainer)).to.exist;
        expect(domQuery('.textarea .cm-content', testContainer)).not.to.exist;
      });


      it('should use FEEL editor after changing expression language', inject(
        function(literalExpression, viewer) {

          // when
          literalExpression.setExpressionLanguage(
            viewer.getRootElement().decisionLogic, 'feel'
          );

          // then
          expect(domQuery('.textarea .cm-content', testContainer)).to.exist;
        }
      ));

    });


    describe('configured default expression language', function() {

      beforeEach(bootstrapModeler(literalExpressionXML, {
        expressionLanguages: {
          options: JUEL_AND_FEEL,
          defaults: { editor: 'juel' }
        }
      }));


      it('should use text editor if default is not FEEL', function() {

        // then
        expect(domQuery('.textarea', testContainer)).to.exist;
        expect(domQuery('.textarea .cm-content', testContainer)).not.to.exist;
      });


      it('should use FEEL editor if expression language is FEEL', inject(
        function(literalExpression, viewer) {

          // when
          literalExpression.setExpressionLanguage(
            viewer.getRootElement().decisionLogic, 'feel'
          );

          // then
          expect(domQuery('.textarea .cm-content', testContainer)).to.exist;
        }
      ));

    });

  });

});
