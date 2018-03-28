import {
  bootstrapViewer,
  inject
} from 'test/TestHelper';

import TestContainer from 'mocha-test-container-support';

import coreModule from 'lib/core';
import editorActionsModule from 'lib/features/editor-actions';
import labelEditingModule from 'lib/features/label-editing';
import keyboardModule from 'lib/features/keyboard';
import modelingModule from 'lib/features/modeling';

import {
  createKeyEvent
} from 'diagram-js/test/util/KeyEvents';

/* global sinon */


describe('features - keyboard', function() {

  var diagramXML = require('../../../fixtures/dmn/di.dmn');

  beforeEach(bootstrapViewer(diagramXML, {
    modules: [
      coreModule,
      labelEditingModule,
      keyboardModule,
      editorActionsModule,
      modelingModule
    ]
  }));


  describe('drd key bindings', function() {

    var container;

    beforeEach(function() {
      container = TestContainer.get(this);
    });

    it('should include triggers inside editorActions', inject(function(editorActions) {
      // then
      expect(editorActions.length()).to.equal(11);
    }));


    it('should trigger lasso tool', inject(function(keyboard, lassoTool) {

      sinon.spy(lassoTool, 'activateSelection');

      // given
      var e = createKeyEvent(container, 76, false);

      // when
      keyboard._keyHandler(e);

      // then
      expect(lassoTool.activateSelection.calledOnce).to.be.true;
    }));


    it('should trigger direct editing', inject(
      function(keyboard, selection, elementRegistry, directEditing) {

        sinon.spy(directEditing, 'activate');

        // given
        var knowledgeSource = elementRegistry.get('host_ks');

        selection.select(knowledgeSource);

        var e = createKeyEvent(container, 69, false);

        // when
        keyboard._keyHandler(e);

        // then
        expect(directEditing.activate.calledOnce).to.be.true;
      }
    ));


    it('should select all elements', inject(
      function(canvas, keyboard, selection, elementRegistry) {

        // given
        var e = createKeyEvent(container, 65, true);

        var allElements = elementRegistry.getAll(),
            rootElement = canvas.getRootElement();

        // when
        keyboard._keyHandler(e);

        // then
        var selectedElements = selection.get();

        expect(selectedElements).to.have.length(allElements.length - 1);
        expect(selectedElements).not.to.contain(rootElement);
      }
    ));

  });

});
