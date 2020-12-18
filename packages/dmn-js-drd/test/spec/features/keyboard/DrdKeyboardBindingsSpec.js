import {
  bootstrapViewer,
  inject
} from 'test/TestHelper';

import {
  forEach
} from 'min-dash';

import coreModule from 'src/core';
import editorActionsModule from 'src/features/editor-actions';
import labelEditingModule from 'src/features/label-editing';
import lassoToolModule from 'diagram-js/lib/features/lasso-tool';
import handToolModule from 'diagram-js/lib/features/hand-tool';
import keyboardModule from 'src/features/keyboard';
import modelingModule from 'src/features/modeling';

import {
  createKeyEvent
} from 'test/util/KeyEvents';

/* global sinon */


describe('features - keyboard', function() {

  var diagramXML = require('../../../fixtures/dmn/di.dmn');

  beforeEach(bootstrapViewer(diagramXML, {
    modules: [
      coreModule,
      labelEditingModule,
      lassoToolModule,
      handToolModule,
      keyboardModule,
      editorActionsModule,
      modelingModule
    ]
  }));


  describe('drd keyboard bindings', function() {

    it('should include triggers inside editorActions', inject(function(editorActions) {

      // given
      var expectedActions = [
        'undo',
        'redo',
        'zoom',
        'removeSelection',
        'selectElements',
        'lassoTool',
        'handTool',
        'directEditing'
      ];

      // then
      expect(editorActions.getActions()).to.eql(expectedActions);
    }));


    forEach(['l', 'L'], function(key) {

      it('should trigger lasso tool for key ' + key, inject(
        function(keyboard, lassoTool) {

          sinon.spy(lassoTool, 'toggle');

          // given
          var e = createKeyEvent(key);

          // when
          keyboard._keyHandler(e);

          // then
          expect(lassoTool.toggle).to.have.been.calledOnce;
        }
      ));

    });


    forEach(['h', 'H'], function(key) {

      it('should trigger hand tool for key ' + key, inject(
        function(keyboard, handTool) {

          sinon.spy(handTool, 'toggle');

          // given
          var e = createKeyEvent(key);

          // when
          keyboard._keyHandler(e);

          // then
          expect(handTool.toggle).to.have.been.calledOnce;
        }
      ));

    });


    forEach(['e', 'E'], function(key) {

      it('should trigger direct editing', inject(
        function(keyboard, selection, elementRegistry, directEditing) {

          sinon.spy(directEditing, 'activate');

          // given
          var task = elementRegistry.get('guestCount');

          selection.select(task);

          var e = createKeyEvent(key);

          // when
          keyboard._keyHandler(e);

          // then
          expect(directEditing.activate).to.have.been.calledOnce;
        }
      ));

    });


    forEach(['a', 'A'], function(key) {

      it('should select all elements',
        inject(function(canvas, keyboard, selection, elementRegistry) {

          // given
          var e = createKeyEvent(key, { ctrlKey: true });

          var allElements = elementRegistry.getAll(),
              rootElement = canvas.getRootElement();

          // when
          keyboard._keyHandler(e);

          // then
          var selectedElements = selection.get();

          expect(selectedElements).to.have.length(allElements.length - 1);
          expect(selectedElements).not.to.contain(rootElement);
        })
      );

    });

  });

});