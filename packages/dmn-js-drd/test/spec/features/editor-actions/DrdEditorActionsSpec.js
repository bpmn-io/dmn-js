import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';


import drdEditorActionsModule from 'src/features/editor-actions';
import modelingModule from 'src/features/modeling';
import alignElementsModule from 'diagram-js/lib/features/align-elements';
import distributeElementsModule from 'src/features/distribute-elements';
import coreModule from 'src/core';

var diagramXML = require('./DrdEditorActions.dmn');


describe('features/editor-actions', function() {

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      coreModule,
      modelingModule,
      drdEditorActionsModule,
      alignElementsModule,
      distributeElementsModule
    ]
  }));


  describe('alignElements', function() {

    it('should align', inject(function(selection, elementRegistry, editorActions) {

      // given
      var a = elementRegistry.get('A');
      var b = elementRegistry.get('B');

      // when
      selection.select([ a, b ]);

      editorActions.trigger('alignElements', {
        type: 'center'
      });

      // then
      expect(a.x).to.eql(b.x);
    }));

  });


  describe('distributeElements', function() {

    it('should distribute', inject(function(selection, elementRegistry, editorActions) {

      // given
      var b = elementRegistry.get('B');
      var c = elementRegistry.get('C');
      var d = elementRegistry.get('D');

      // when
      selection.select([ b, c, d ]);

      editorActions.trigger('distributeElements', {
        type: 'horizontal'
      });

      // then
      expect(b.x).to.eql(435);
    }));

  });

});
