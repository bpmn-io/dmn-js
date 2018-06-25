import {
  bootstrapModeler,
  inject
} from 'test/helper';

import CoreModule from 'src/core';
import KeyboardModule from 'src/features/keyboard';
import ModelingModule from 'src/features/modeling';
import DecisionRulesModule from 'src/features/decision-rules';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import SelectionModule from 'table-js/lib/features/selection';

import diagramXML from './diagram.dmn';


describe('features/keyboard', function() {

  const keyboardTarget = document.createElement('div');

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      CoreModule,
      ModelingModule,
      KeyboardModule,
      DecisionRulesModule,
      DecisionRulesEditorModule,
      SelectionModule
    ],
    keyboard: {
      bindTo: keyboardTarget
    }
  }));

  describe('keyboard binding', function() {

    it('should integrate with <attach> + <detach> events', inject(
      function(keyboard, eventBus) {

        // assume
        expect(keyboard._node).to.eql(keyboardTarget);

        // when
        eventBus.fire('detach');
        expect(keyboard._node).not.to.exist;

        // but when
        eventBus.fire('attach');
        expect(keyboard._node).to.eql(keyboardTarget);
      }
    ));

  });


  describe('default listeners', function() {

  });

});