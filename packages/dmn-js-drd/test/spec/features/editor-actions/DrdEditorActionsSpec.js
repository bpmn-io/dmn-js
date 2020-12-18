import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';


import drdEditorActionsModule from 'src/features/editor-actions';
import modelingModule from 'src/features/modeling';
import alignElementsModule from 'diagram-js/lib/features/align-elements';
import lassoToolModule from 'diagram-js/lib/features/lasso-tool';
import handToolModule from 'diagram-js/lib/features/hand-tool';
import distributeElementsModule from 'src/features/distribute-elements';
import coreModule from 'src/core';
import lassoTool from 'diagram-js/lib/features/lasso-tool';

var diagramXML = require('./DrdEditorActions.dmn');


describe('features/editor-actions', function() {

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [
      coreModule,
      modelingModule,
      drdEditorActionsModule,
      alignElementsModule,
      distributeElementsModule,
      lassoToolModule,
      handToolModule,
      lassoTool
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


  describe('handTool', function() {

    it('should toggle', inject(function(editorActions, handTool) {

      // given
      editorActions.trigger('handTool');

      // assume
      expect(handTool.isActive()).to.be.true;

      // when
      editorActions.trigger('handTool');

      // then
      expect(!!handTool.isActive()).to.be.false;
    }));

  });


  describe('lassoTool', function() {

    it('should toggle', inject(function(editorActions, lassoTool) {

      // given
      editorActions.trigger('lassoTool');

      // assume
      expect(lassoTool.isActive()).to.be.true;

      // when
      editorActions.trigger('lassoTool');

      // then
      expect(!!lassoTool.isActive()).to.be.false;
    }));

  });

});
