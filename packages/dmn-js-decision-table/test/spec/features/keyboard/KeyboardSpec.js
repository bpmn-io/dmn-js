import { bootstrapModeler, inject } from 'test/helper';

import diagramXML from './diagram.dmn';

import CoreModule from 'lib/core';
import KeyboardModule from 'lib/features/keyboard';
import ModelingModule from 'lib/features/modeling';


describe('features/keyboard', function() {

  var keyboardTarget = document.createElement('div');

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      CoreModule,
      ModelingModule,
      KeyboardModule
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

});