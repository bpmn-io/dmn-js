import { bootstrapModeler, getDecisionTable, inject } from 'test/helper';

import { query as domQuery, queryAll as domQueryAll } from 'min-dom';
import { find } from 'min-dash';

import TestContainer from 'mocha-test-container-support';

import {
  triggerInputEvent,
  triggerInputSelectChange
} from 'dmn-js-shared/test/util/EventUtil';

import elXML from '../../expression-language.dmn';

import ContextMenuModule from 'src/features/context-menu';
import CoreModule from 'src/core';
import ExpressionLanguageModule from 'src/features/expression-language';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'src/features/modeling';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import KeyboardModule from 'src/features/keyboard';


const CUSTOM_EXPRESSION_LANGUAGES = [ {
  label: 'FEEL',
  value: 'feel'
}, {
  label: 'JUEL',
  value: 'juel'
}, {
  label: 'JavaScript',
  value: 'javascript'
}, {
  label: 'Groovy',
  value: 'groovy'
}, {
  label: 'Python',
  value: 'python'
}, {
  label: 'JRuby',
  value: 'jruby'
} ];


describe('expression language', function() {

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function openContextMenu(elementId, type = 'expression-language', ctx = {}) {
    getDecisionTable().invoke(function(contextMenu) {
      contextMenu.open({
        x: 0,
        y: 0
      }, {
        contextMenuType: type,
        id: elementId,
        ...ctx
      });
    });

    return domQuery('.expression-language', testContainer);
  }


  describe('basic', function() {

    beforeEach(bootstrapModeler(elXML, {
      modules: [
        ContextMenuModule,
        CoreModule,
        ExpressionLanguageModule,
        InteractionEventsModule,
        ModelingModule,
        DecisionRulesEditorModule,
        KeyboardModule
      ],
      debounceInput: false
    }));


    it('should edit expression language - input', inject(function(elementRegistry) {

      // given
      const inputSelect = openContextMenu('inputEntry1');

      const input = domQuery('.dms-input', inputSelect);

      // when
      triggerInputEvent(input, 'foo');

      // then
      const expressionLanguage =
        elementRegistry.get('inputEntry1').businessObject.expressionLanguage;

      expect(expressionLanguage).to.equal('foo');
    }));


    it('should display context menu entry if cell\'s EL is non-default', function() {

      // when
      openContextMenu('inputEntry1', 'context-menu');

      // then
      const entries = domQueryAll('.context-menu-group-entry', testContainer);
      const entry = find(entries, entry => {
        return entry.textContent === 'Change cell expression language';
      });

      expect(entry).to.exist;
    });


    it('should display if the input\'s expression language is non-default',
      inject(function(elementRegistry) {

        // given
        const input = elementRegistry.get('input1');

        // when
        openContextMenu('input1', 'input-edit', { input: input.businessObject });

        // then
        const entry = domQuery('.ref-language', testContainer);

        expect(entry).to.exist;
      })
    );


    it('should NOT display if the cell\'s expression language is the only one available',
      function() {

        // when
        openContextMenu('inputEntry2', 'context-menu');

        // then
        const entries = domQueryAll('.context-menu-group-entry', testContainer);
        const entry = find(entries, entry => {
          return entry.textContent === 'Change cell expression Language';
        });

        expect(entry).not.to.exist;
      }
    );


    it('should NOT display if the input\'s expression language is the only one available',
      inject(function(elementRegistry) {

        // given
        const input = elementRegistry.get('input2');

        // when
        openContextMenu('input2', 'input-edit', { input: input.businessObject });

        // then
        const entry = domQuery('.ref-language', testContainer);

        expect(entry).not.to.exist;
      })
    );
  });


  describe('custom expression languages', function() {


    beforeEach(bootstrapModeler(elXML, {
      expressionLanguages: {
        options: CUSTOM_EXPRESSION_LANGUAGES
      },
      modules: [
        ContextMenuModule,
        CoreModule,
        ExpressionLanguageModule,
        InteractionEventsModule,
        ModelingModule,
        DecisionRulesEditorModule,
        KeyboardModule
      ],
      debounceInput: false
    }));

    it('should edit expression language - select', inject(function(elementRegistry) {

      // given
      const inputSelect = openContextMenu('inputEntry1');

      // when
      triggerInputSelectChange(inputSelect, 'javascript', testContainer);

      // then
      const expressionLanguage =
      elementRegistry.get('inputEntry1').businessObject.expressionLanguage;

      expect(expressionLanguage).to.equal('javascript');
    }));


    it('should display context menu entry if multiple ELs are available', function() {

      // when
      openContextMenu('inputEntry2', 'context-menu');

      // then
      const entries = domQueryAll('.context-menu-group-entry', testContainer);
      const entry = find(entries, entry => {
        return entry.textContent === 'Change cell expression language';
      });

      expect(entry).to.exist;
    });


    it('should display input entry if multiple ELs are available',
      inject(function(elementRegistry) {

        // given
        const input = elementRegistry.get('input2');

        // when
        openContextMenu('input2', 'input-edit', { input: input.businessObject });

        // then
        const entry = domQuery('.ref-language', testContainer);

        expect(entry).to.exist;
      })
    );
  });
});
